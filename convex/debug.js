import { query } from "./_generated/server";

export const listUsers = query({
  handler: async ({ db }) => {
    const users = await db.query("users").collect();
    return users.map((u) => ({
      id: u._id ? String(u._id) : null,
      email: u.email,
      storedPasswordLength: u.password ? u.password.length : 0,
      createdAt: u.createdAt || null,
    }));
  },
});
