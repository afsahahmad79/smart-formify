import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const updateRole = mutation({
  args: {
    id: v.id("users"),
    role: v.union(v.literal("user"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Not authorized");
    }

    const targetUser = await ctx.db.get(args.id);
    if (!targetUser) {
      throw new Error("User not found");
    }

    await ctx.db.patch(args.id, { role: args.role });
  },
});

export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();
    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Not authorized");
    }

    const targetUser = await ctx.db.get(args.id);
    if (!targetUser) {
      throw new Error("User not found");
    }

    // Prevent self-deletion
    if (targetUser._id === currentUser._id) {
      throw new Error("Cannot delete yourself");
    }

    await ctx.db.delete(args.id);
  },
});

export const signup = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", q => q.eq("tokenIdentifier", args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create user in database
    const userId = await ctx.db.insert("users", {
      name: args.name,
      tokenIdentifier: args.email, // Using email as token identifier for Convex auth
      role: "user",
    });

    return { success: true, userId };
  },
});

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", q => q.eq("tokenIdentifier", args.email))
      .first();

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // TODO: Implement proper password hashing and verification
    // For now, this is a placeholder - in production you should:
    // 1. Hash passwords with bcrypt or similar
    // 2. Store password hash in the database
    // 3. Compare hash here instead of plain text comparison
    // Example:
    // const bcrypt = require('bcrypt');
    // const isValidPassword = await bcrypt.compare(args.password, user.passwordHash);
    // if (!isValidPassword) {
    //   throw new Error("Invalid credentials");
    // }

    // SECURITY WARNING: This is insecure - implement proper password verification
    console.warn("WARNING: Password verification not implemented - using insecure comparison");

    // Generate a token for Convex Auth system
    // This integrates with the AUTH_SECRET from environment variables
    const tokenIdentifier = `custom:${args.email}`;

    return {
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.tokenIdentifier,
        role: user.role,
      },
      tokenIdentifier
    };
  },
});

export const logout = mutation({
  args: {},
  handler: async (ctx, args) => {
    // Convex handles logout through token expiration
    // This mutation can be used for cleanup if needed
    return { success: true };
  },
});