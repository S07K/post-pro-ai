import { describe, it, expect, vi, beforeEach } from "vitest";
import axios, { AxiosError } from "axios";
import {
  findInstagramAccount,
  getMissingPermissions,
  verifyInstagramConnection,
  publishToInstagram,
  MetaPublishError,
} from "@/lib/meta";

vi.mock("axios", async () => {
  const actual = await vi.importActual<typeof import("axios")>("axios");
  return { ...actual, default: { ...actual.default, get: vi.fn(), post: vi.fn() } };
});

const get = vi.mocked(axios.get);

function graphError(message: string) {
  return new AxiosError("Request failed", "ERR_BAD_REQUEST", undefined, undefined, {
    data: { error: { message } },
    status: 400,
  } as any);
}

beforeEach(() => {
  get.mockReset();
  vi.mocked(axios.post).mockReset();
});

describe("findInstagramAccount", () => {
  it("picks the first shared Page that has an Instagram account, not just the first Page", async () => {
    get.mockResolvedValueOnce({
      data: {
        data: [
          { id: "page-1", name: "No Instagram" },
          { id: "page-2", name: "Brand Page", instagram_business_account: { id: "ig-2" } },
        ],
      },
    });

    await expect(findInstagramAccount("tok")).resolves.toEqual({ pageId: "page-2", pageName: "Brand Page", instagramId: "ig-2" });
  });

  it("explains when no Pages were shared", async () => {
    get.mockResolvedValueOnce({ data: { data: [] } });
    await expect(findInstagramAccount("tok")).rejects.toThrow(/No Facebook Pages were shared/);
  });

  it("explains when no shared Page has an Instagram account", async () => {
    get.mockResolvedValueOnce({ data: { data: [{ id: "page-1", name: "Only Page" }] } });
    await expect(findInstagramAccount("tok")).rejects.toThrow(/Instagram professional account/);
  });
});

describe("getMissingPermissions", () => {
  it("returns required permissions that were declined or never requested", async () => {
    get.mockResolvedValueOnce({
      data: {
        data: [
          { permission: "pages_show_list", status: "granted" },
          { permission: "pages_read_engagement", status: "granted" },
          { permission: "instagram_basic", status: "declined" },
        ],
      },
    });

    await expect(getMissingPermissions("tok")).resolves.toEqual(["instagram_basic", "instagram_content_publish"]);
  });
});

describe("verifyInstagramConnection", () => {
  it("rejects a token that is missing required permissions", async () => {
    get.mockResolvedValueOnce({ data: { data: [{ permission: "pages_show_list", status: "granted" }] } });

    const promise = verifyInstagramConnection("tok");
    await expect(promise).rejects.toBeInstanceOf(MetaPublishError);
    await expect(promise).rejects.toThrow(/instagram_content_publish/);
  });

  it("turns a Graph API error into a MetaPublishError with Facebook's message", async () => {
    get.mockRejectedValueOnce(graphError("Error validating access token: Session has expired"));

    const promise = verifyInstagramConnection("tok");
    await expect(promise).rejects.toBeInstanceOf(MetaPublishError);
    await expect(promise).rejects.toThrow(/Session has expired/);
  });

  it("returns the Instagram account when everything is in place", async () => {
    get
      .mockResolvedValueOnce({
        data: {
          data: ["pages_show_list", "pages_read_engagement", "instagram_basic", "instagram_content_publish"].map((permission) => ({
            permission,
            status: "granted",
          })),
        },
      })
      .mockResolvedValueOnce({ data: { data: [{ id: "page-1", name: "Brand", instagram_business_account: { id: "ig-1" } }] } });

    await expect(verifyInstagramConnection("tok")).resolves.toMatchObject({ instagramId: "ig-1" });
  });
});

describe("publishToInstagram", () => {
  it("reports Facebook's own error message when publishing fails", async () => {
    get.mockRejectedValueOnce(graphError("Invalid OAuth access token"));

    await expect(publishToInstagram("tok", "https://x/y.jpg", "caption")).resolves.toEqual({
      status: "failed",
      reason: "Invalid OAuth access token",
    });
  });
});
