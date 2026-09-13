import { describe, it, expect, vi } from "vitest";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/user";
import { authOptions } from "@/lib/auth";

// CredentialsProvider keeps the user-supplied authorize() on `options`
const authorize = (authOptions.providers[0] as any).options.authorize as (
  credentials: Record<string, string>
) => Promise<{ id: string; email: string } | null>;

async function insertLegacyUser(email: string, password: string) {
  await connectDB();
  // Bypass the model's lowercase setter to mimic accounts created by the old Express backend
  const { insertedId } = await User.collection.insertOne({ email, password, createdAt: new Date() });
  return insertedId.toString();
}

describe("credentials authorize", () => {
  it("signs in an old-backend account whose email has uppercase letters", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const id = await insertLegacyUser("Alice@Example.com", await bcrypt.hash("password123", 10));

    const user = await authorize({ email: "alice@example.com", password: "password123" });
    expect(user?.id).toBe(id);
  });

  it("rejects a wrong password", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    await insertLegacyUser("bob@example.com", await bcrypt.hash("password123", 10));

    expect(await authorize({ email: "bob@example.com", password: "wrong-password" })).toBeNull();
  });

  it("rejects an account whose stored password is not a bcrypt hash", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    await insertLegacyUser("carol@example.com", "password123");

    expect(await authorize({ email: "carol@example.com", password: "password123" })).toBeNull();
    expect(warn).toHaveBeenCalledWith("[auth] sign-in failed: stored password is not a bcrypt hash");
  });

  it("rejects an unknown email", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await authorize({ email: "nobody@example.com", password: "password123" })).toBeNull();
  });
});
