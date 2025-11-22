"use client";

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
  useState,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { useUser, useSignIn, useSignUp, useClerk } from "@clerk/nextjs";

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  loading: boolean;
  resetInactivityTimer: () => void;
  loginWithOAuth: (provider: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Clerk hooks
  const clerkUser = useUser();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const clerk = useClerk();

  // ✅ Make logout stable (useCallback) so it doesn’t re-trigger useEffects
  const logout = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      await clerk.signOut();
      setUser(null);
      router.push("/auth/sign-in");
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [clerk, router]);

  // ✅ login
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setLoading(true);
      try {
        if (!signInLoaded) {
          throw new Error("Auth not loaded");
        }

        const result = await signIn.create({ identifier: email, password });
        console.debug("Clerk signIn result:", result);
        const status = (result as any)?.status;

        if (status === "complete") {
          const u = clerkUser.user;
          if (u) {
            setUser({
              id: u.id,
              email: u.primaryEmailAddress?.emailAddress || "",
              name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
              role: "user",
            });
          }
          return true;
        }

        if (status === "needs_email_verification") {
          throw new Error("Email verification required. Please check your inbox.");
        }
        if (status === "missing_password" || status === "no_password") {
          throw new Error("Account exists but no password is set.");
        }

        throw new Error(`Sign-in did not complete (status=${String(status)}).`);
      } catch (error: any) {
        console.error("Login failed:", error);
        if (error instanceof TypeError && /failed to fetch/i.test(error.message)) {
          throw new Error(
            "Network error contacting auth provider. Check your internet connection or try in incognito mode."
          );
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [signInLoaded, signIn, clerkUser.user]
  );

  // ✅ signup
  const signup = useCallback(
    async (email: string, password: string, name: string): Promise<boolean> => {
      setLoading(true);
      try {
        if (!signUpLoaded) {
          throw new Error("Auth not loaded");
        }

        const result = await signUp.create({
          emailAddress: email,
          password,
          firstName: name,
        });
        console.debug("Clerk signUp result:", result);
        const status = (result as any)?.status;

        if (status === "complete") {
          const u = clerkUser.user;
          if (u) {
            setUser({
              id: u.id,
              email: u.primaryEmailAddress?.emailAddress || "",
              name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
              role: "user",
            });
          }
          return true;
        }

        if (status === "needs_email_verification") {
          throw new Error("Verification required. Please check your email.");
        }

        if (status === "needs_phone_verification") {
          throw new Error("Phone verification required. Please verify your phone.");
        }

        throw new Error(`Signup did not complete (status=${String(status)}).`);
      } catch (error: any) {
        console.error("Signup failed:", error);
        if (error instanceof TypeError && /failed to fetch/i.test(error.message)) {
          throw new Error(
            "Network error contacting auth provider. Check your connection or try again."
          );
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [signUpLoaded, signUp, clerkUser.user]
  );

  // ✅ Stable inactivity reset function
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    if (user) {
      inactivityTimerRef.current = setTimeout(() => {
        console.log("Inactivity timeout reached, logging out...");
        logout();
      }, 5 * 60 * 1000); // 5 minutes
    }
  }, [user, logout]);

  // ✅ Sync Clerk user with local state (run only when clerkUser.user changes)
  useEffect(() => {
    if (clerkUser?.isLoaded && clerkUser.user) {
      const u = clerkUser.user;
      setUser({
        id: u.id,
        email: u.primaryEmailAddress?.emailAddress || "",
        name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
        role: "user",
      });
    }
  }, [clerkUser?.isLoaded, clerkUser?.user]);

  // ✅ Manage inactivity timer safely
  useEffect(() => {
    if (!user) return;

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleUserActivity = () => resetInactivityTimer();

    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity);
    });

    resetInactivityTimer();

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [user, resetInactivityTimer]);

  const loginWithOAuth = useCallback((provider: string) => {
    if (typeof window !== "undefined") {
      window.location.href = `/sign-in?provider=${encodeURIComponent(provider)}`;
    }
  }, []);

  // ✅ Memoize context value to prevent unnecessary re-renders
  const value = useMemo<AuthContextType>(
    () => ({
      user,
      login,
      signup,
      logout,
      loading,
      resetInactivityTimer,
      loginWithOAuth,
    }),
    [user, login, signup, logout, loading, resetInactivityTimer, loginWithOAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
