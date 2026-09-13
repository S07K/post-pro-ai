import { describe, it, expect } from "vitest";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/user";
import { POST as register } from "@/app/api/register/route";

function req(body: unknown) {
  return new Request("http://test/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/register", () => {
  it("creates a user with a bcrypt-hashed password, never plaintext", async () => {
    const res = await register(req({ email: "alice@example.com", password: "password123" }));
    expect(res.status).toBe(200);

    await connectDB();
    const user = await User.findOne({ email: "alice@example.com" });
    expect(user).not.toBeNull();
    expect(user!.password).not.toBe("password123");
    expect(await bcrypt.compare("password123", user!.password)).toBe(true);
  });

  it("rejects a duplicate email with 409", async () => {
    await register(req({ email: "bob@example.com", password: "password123" }));
    const res = await register(req({ email: "bob@example.com", password: "anotherpassword" }));
    expect(res.status).toBe(409);
  });

  it("rejects a weak password with 422", async () => {
    const res = await register(req({ email: "carol@example.com", password: "short" }));
    expect(res.status).toBe(422);
  });
});
