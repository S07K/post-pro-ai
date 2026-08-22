import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/** Returns the authenticated user's id, or null if there is no session. */
export async function requireUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}
