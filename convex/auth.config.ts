// This file configures authentication for Convex
// Clerk is configured with production keys

export default {
  providers: [
    // Main Clerk provider for email/password authentication
    {
      domain: "https://ethical-gibbon-40.clerk.accounts.dev",
      applicationID: "convex",
    }, 
    // Google OAuth provider
    {
      domain: "accounts.google.com",
      applicationID: "convex",
    },
    
  ],
};
