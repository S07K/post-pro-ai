import { describe, it, expect } from "vitest";
import { mongoConnectOptions } from "@/lib/db/mongoose";

describe("mongoConnectOptions", () => {
  it("passes MONGO_USER and MONGO_PASSWORD as driver auth when both are set", () => {
    const options = mongoConnectOptions({ MONGO_USER: "app-user", MONGO_PASSWORD: "s3cret" });
    expect(options.auth).toEqual({ username: "app-user", password: "s3cret" });
  });

  it("passes a password with URI-breaking characters through unencoded", () => {
    const password = "p@ss:w/rd#100%?&";
    const options = mongoConnectOptions({ MONGO_USER: "app-user", MONGO_PASSWORD: password });
    expect(options.auth?.password).toBe(password);
  });

  it("omits auth when credentials are not set, so MONGO_URI is used as-is", () => {
    expect(mongoConnectOptions({}).auth).toBeUndefined();
  });

  it("omits auth when only one of MONGO_USER or MONGO_PASSWORD is set", () => {
    expect(mongoConnectOptions({ MONGO_USER: "app-user" }).auth).toBeUndefined();
    expect(mongoConnectOptions({ MONGO_PASSWORD: "s3cret" }).auth).toBeUndefined();
  });

  it("always sets a short server selection timeout", () => {
    expect(mongoConnectOptions({}).serverSelectionTimeoutMS).toBe(5000);
  });
});
