import { ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

export const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
export { api };
export type { Id };
