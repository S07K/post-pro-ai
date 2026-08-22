import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "@/lib/validation/auth";
import { createProjectSchema, updateProjectSchema, setAccessSchema } from "@/lib/validation/project";
import { createPostSchema, updatePostSchema, generateImageSchema } from "@/lib/validation/post";

describe("auth validation", () => {
  it("accepts a valid registration payload", () => {
    const result = registerSchema.safeParse({ email: "Alice@Example.com", password: "password123" });
    expect(result.success).toBe(true);
    if (result.success) {
      // email is normalized to lowercase
      expect(result.data.email).toBe("alice@example.com");
    }
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({ email: "alice@example.com", password: "short" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({ email: "not-an-email", password: "password123" });
    expect(result.success).toBe(false);
  });

  it("login only requires a non-empty password (no minimum length)", () => {
    const result = loginSchema.safeParse({ email: "alice@example.com", password: "x" });
    expect(result.success).toBe(true);
  });
});

describe("project validation", () => {
  it("fills in defaults on create", () => {
    const result = createProjectSchema.safeParse({ title: "My Project" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.captionLimit).toBe(100);
      expect(result.data.postLimit).toBe(10);
      expect(result.data.hashtags).toBe(true);
    }
  });

  it("rejects an empty title", () => {
    const result = createProjectSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("update allows a partial payload", () => {
    const result = updateProjectSchema.safeParse({ title: "Renamed" });
    expect(result.success).toBe(true);
  });

  it("set_access only accepts the facebook connection literal", () => {
    const ok = setAccessSchema.safeParse({ token: "abc", connection: "facebook" });
    const bad = setAccessSchema.safeParse({ token: "abc", connection: "twitter" });
    expect(ok.success).toBe(true);
    expect(bad.success).toBe(false);
  });
});

describe("post validation", () => {
  it("accepts a post with no scheduledAt", () => {
    const result = createPostSchema.safeParse({ projectId: "p1", image: "https://x/y.jpg" });
    expect(result.success).toBe(true);
  });

  it("rejects a scheduledAt in the past", () => {
    const result = createPostSchema.safeParse({
      projectId: "p1",
      image: "https://x/y.jpg",
      scheduledAt: new Date(Date.now() - 60_000).toISOString(),
    });
    expect(result.success).toBe(false);
  });

  it("accepts a scheduledAt in the future", () => {
    const result = createPostSchema.safeParse({
      projectId: "p1",
      image: "https://x/y.jpg",
      scheduledAt: new Date(Date.now() + 60_000).toISOString(),
    });
    expect(result.success).toBe(true);
  });

  it("updatePostSchema rejects a caption over the limit", () => {
    const result = updatePostSchema.safeParse({ caption: "a".repeat(2201) });
    expect(result.success).toBe(false);
  });

  it("generateImageSchema requires a non-empty prompt", () => {
    const result = generateImageSchema.safeParse({ prompt: "", projectId: "p1" });
    expect(result.success).toBe(false);
  });
});
