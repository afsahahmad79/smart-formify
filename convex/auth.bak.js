import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const login = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async ({ db }, { email, password }) => {
    // Example logic: Validate user credentials
    try {
      const normEmail = String(email).trim().toLowerCase();
      const normPassword = String(password).trim();
      const user = await db.query("users").filter(q => q.eq("email", normEmail)).first();

      // Diagnostic logging (safe): do NOT log plaintext passwords.
      console.log('Login handler - normalized email:', normEmail);
      console.log('Login handler - entered password length:', typeof normPassword === 'string' ? normPassword.length : 'n/a');
      if (!user) {
        console.log('Login handler - no user found for email:', normEmail);
        throw new Error("Invalid email or password");
      }
      console.log('Login handler - user found:', { id: user._id ? String(user._id) : null, email: user.email, storedPasswordLength: user.password ? user.password.length : 0 });
      if (user.password !== normPassword) {
        console.log('Login handler - password mismatch (entered length vs stored length):', { entered: normPassword.length, stored: user.password ? user.password.length : 0 });
        throw new Error("Invalid email or password");
      }
      return { user };
    } catch (err) {
      console.error('Login error:', err);
      throw new Error(`Login failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  },
});

export const signup = mutation({
  args: { email: v.string(), password: v.string(), name: v.string() },
  handler: async ({ db }, { email, password, name }) => {
    // Example logic: Create a new user
    try {
      const normEmail = String(email).trim().toLowerCase();
      const normPassword = String(password).trim();
      const existingUser = await db.query("users").filter(q => q.eq("email", normEmail)).first();
      if (existingUser) {
        throw new Error("User already exists");
      }
      const userId = await db.insert("users", { 
        email: normEmail, 
        password: normPassword, 
        name, 
        role: "user", 
        createdAt: Date.now() 
      });
      const user = await db.get(userId);
      return { user };
    } catch (err) {
      console.error('Signup error:', err);
      // Provide more detailed message to the client while avoiding sensitive info
      throw new Error(`Signup failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  },
});

export const logout = mutation({
  args: {},
  handler: async () => {
    // Example logic: Handle logout
    return { success: true };
  },
});

