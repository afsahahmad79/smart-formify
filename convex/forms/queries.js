import { query } from "../_generated/server";
import { v } from "convex/values";

export const listForms = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const forms = await ctx.db
      .query("forms")
      .filter(q => q.eq(q.field("createdBy"), identity.subject))
      .collect();

    return forms;
  },
});

export const getForm = query({
  args: { id: v.id("forms") },
  handler: async (ctx, args) => {
    const form = await ctx.db.get(args.id);
    if (!form) {
      throw new Error("Form not found");
    }
    return form;
  },
});

export const getPublishedForm = query({
  args: { id: v.id("forms") },
  handler: async (ctx, args) => {
    const form = await ctx.db.get(args.id);
    if (!form || form.status !== "published") {
      throw new Error("Form not found or not published");
    }
    return form;
  },
});
