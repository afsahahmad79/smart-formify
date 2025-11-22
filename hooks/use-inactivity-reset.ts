import { useAuth } from "@/components/auth/auth-context";

/**
 * Hook to reset the inactivity timer
 * Use this in components where you want to extend the user session
 */
export function useInactivityReset() {
  const { resetInactivityTimer } = useAuth();
  
  const resetTimer = () => {
    resetInactivityTimer();
  };
  
  return { resetTimer };
}
