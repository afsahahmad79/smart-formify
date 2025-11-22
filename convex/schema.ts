
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    createdAt: v.optional(v.float64()),
    email: v.optional(v.string()),
    name: v.string(),
    password: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("admin")),
    tokenIdentifier: v.optional(v.string()),
  }),

  forms: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    elements: v.array(v.object({
      id: v.string(),
      type: v.string(),
      label: v.string(),
      required: v.optional(v.boolean()),
      options: v.optional(v.array(v.string())),
      placeholder: v.optional(v.string()),
      validation: v.optional(v.object({
        minLength: v.optional(v.number()),
        maxLength: v.optional(v.number()),
        pattern: v.optional(v.string()),
      })),
    })),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("unpublished")),
    publishedAt: v.optional(v.number()),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_creator", ["createdBy"]),

  submissions: defineTable({
    formId: v.id("forms"),
    data: v.object({}),
    submittedBy: v.id("users"),
    submittedAt: v.number(),
  }).index("by_form", ["formId"]),

  sessions: defineTable({
    userId: v.id("users"),
    lastActiveAt: v.number(),
    expiresAt: v.number(),
  }).index("by_user", ["userId"]),
});