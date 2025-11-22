"use client";

import React from "react";
import { ClerkProvider, useAuth, useAuth as useClerkAuth } from "@clerk/nextjs";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ChatWidget } from "@/components/chat-widget";
import { AuthProvider } from "@/components/auth/auth-context";
import { ConvexReactClient } from "convex/react";

const convexClient = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        baseTheme: undefined,
        variables: { colorPrimary: "#000000" },
        elements: {
          formButtonPrimary: "bg-black border border-black border-solid hover:bg-white hover:text-black",
          socialButtonsBlockButton: "bg-white border-gray-200 hover:bg-transparent hover:border-black text-gray-500 hover:text-black",
          socialButtonsBlockButtonText: "font-semibold",
          formButtonReset: "bg-white border border-solid border-gray-200 hover:bg-transparent hover:border-black text-gray-500 hover:text-black",
          membersPageInviteButton: "bg-black border border-black border-solid hover:bg-white hover:text-black",
          card: "bg-gray-50",
        },
      }}
      signInUrl="/auth/sign-in"
      signUpUrl="/auth/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
       <ConvexProviderWithClerk client={convexClient} useAuth={useAuth}>
         <AuthProvider>
           {children}
           <ChatWidget />
         </AuthProvider>
       </ConvexProviderWithClerk>
     </ClerkProvider>
   );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <ConvexClientProvider>{children}</ConvexClientProvider>;
}
