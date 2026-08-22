import { describe, it, expect } from "vitest";
import { GET as publishScheduled } from "@/app/api/cron/publish-scheduled/route";

describe("GET /api/cron/publish-scheduled", () => {
  it("rejects requests without the correct cron secret", async () => {
    const res = await publishScheduled(new Request("http://test"));
    expect(res.status).toBe(401);
  });

  it("rejects requests with the wrong secret", async () => {
    const res = await publishScheduled(new Request("http://test", { headers: { authorization: "Bearer wrong" } }));
    expect(res.status).toBe(401);
  });

  it("accepts the correct secret and reports nothing due when there are no posts", async () => {
    const res = await publishScheduled(new Request("http://test", { headers: { authorization: `Bearer ${process.env.CRON_SECRET}` } }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ status: "success", processed: 0, published: 0, failed: 0 });
  });
});
