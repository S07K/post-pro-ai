import axios, { isAxiosError } from "axios";
import { FACEBOOK_GRAPH_VERSION } from "@/app/lib/utils";

const FACEBOOK_API_ENDPOINT = process.env.FACEBOOK_API_ENDPOINT || `https://graph.facebook.com/${FACEBOOK_GRAPH_VERSION}`;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || "";
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || "";

/** Permissions the Facebook Login configuration must grant for publishing to Instagram. */
export const REQUIRED_PERMISSIONS = [
  "pages_show_list",
  "pages_read_engagement",
  "instagram_basic",
  "instagram_content_publish",
];

export class MetaPublishError extends Error {}

/** Pulls the human-readable message out of a Graph API error response, if there is one. */
export function graphErrorMessage(error: unknown): string | null {
  if (isAxiosError(error)) {
    const message = error.response?.data?.error?.message;
    if (typeof message === "string" && message) {
      return message;
    }
  }
  return null;
}

/** Checks whether a Facebook access token is still valid. */
export async function isFacebookTokenValid(token: string): Promise<boolean> {
  try {
    const response = await axios.get(`${FACEBOOK_API_ENDPOINT}/me`, { params: { access_token: token } });
    return Boolean(response.data?.name);
  } catch {
    return false;
  }
}

/** Exchanges a short-lived Facebook token for a long-lived one. */
export async function exchangeForLongLivedToken(token: string): Promise<string> {
  try {
    const response = await axios.get(`${FACEBOOK_API_ENDPOINT}/oauth/access_token`, {
      params: {
        grant_type: "fb_exchange_token",
        client_id: FACEBOOK_APP_ID,
        client_secret: FACEBOOK_APP_SECRET,
        fb_exchange_token: token,
      },
    });
    return response.data?.access_token || token;
  } catch (error) {
    // Log only the message: the axios error's config contains the token and app secret
    console.error("[meta] long-lived token exchange failed:", graphErrorMessage(error) ?? "unknown error");
    return token;
  }
}

/** Returns the required permissions the token was not granted. */
export async function getMissingPermissions(token: string): Promise<string[]> {
  const response = await axios.get(`${FACEBOOK_API_ENDPOINT}/me/permissions`, { params: { access_token: token } });
  const granted = new Set(
    (response.data?.data ?? [])
      .filter((entry: { status?: string }) => entry.status === "granted")
      .map((entry: { permission: string }) => entry.permission)
  );
  return REQUIRED_PERMISSIONS.filter((permission) => !granted.has(permission));
}

export type InstagramAccount = { pageId: string; pageName: string; instagramId: string };

/** Finds the first Facebook Page shared with the app that has an Instagram professional account linked. */
export async function findInstagramAccount(token: string): Promise<InstagramAccount> {
  const response = await axios.get(`${FACEBOOK_API_ENDPOINT}/me/accounts`, {
    params: { access_token: token, fields: "id,name,instagram_business_account", limit: 100 },
  });
  const pages: { id: string; name?: string; instagram_business_account?: { id?: string } }[] = response.data?.data ?? [];
  if (pages.length === 0) {
    throw new MetaPublishError("No Facebook Pages were shared with PostProAI. Reconnect and select the Page linked to your Instagram account.");
  }

  const page = pages.find((candidate) => candidate.instagram_business_account?.id);
  if (!page) {
    throw new MetaPublishError("None of the Facebook Pages you shared has an Instagram professional account linked to it.");
  }
  return { pageId: page.id, pageName: page.name ?? "", instagramId: page.instagram_business_account!.id! };
}

/**
 * Confirms a token can actually publish: every required permission is granted
 * and a shared Page has an Instagram account. Throws MetaPublishError with a
 * message meant for the user otherwise.
 */
export async function verifyInstagramConnection(token: string): Promise<InstagramAccount> {
  try {
    const missing = await getMissingPermissions(token);
    if (missing.length > 0) {
      throw new MetaPublishError(`Facebook didn't grant these permissions: ${missing.join(", ")}. Reconnect and allow all requested permissions.`);
    }
    return await findInstagramAccount(token);
  } catch (error) {
    if (error instanceof MetaPublishError) throw error;
    throw new MetaPublishError(graphErrorMessage(error) ?? "Could not verify the Instagram connection");
  }
}

async function createMediaContainer(instagramId: string, token: string, imageUrl: string, caption: string): Promise<string> {
  const response = await axios.post(
    `${FACEBOOK_API_ENDPOINT}/${instagramId}/media`,
    {},
    { params: { access_token: token, image_url: imageUrl, caption } }
  );
  const containerId = response.data?.id;
  if (!containerId) {
    throw new MetaPublishError("Failed to create Instagram media container");
  }
  return containerId;
}

async function getContainerStatus(containerId: string, token: string): Promise<string> {
  const response = await axios.get(`${FACEBOOK_API_ENDPOINT}/${containerId}`, {
    params: { access_token: token, fields: "status_code" },
  });
  return response.data?.status_code;
}

async function publishContainer(instagramId: string, token: string, containerId: string): Promise<void> {
  const response = await axios.post(
    `${FACEBOOK_API_ENDPOINT}/${instagramId}/media_publish`,
    {},
    { params: { access_token: token, creation_id: containerId } }
  );
  if (!response.data?.id) {
    throw new MetaPublishError("Failed to publish Instagram media");
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function publishFailureReason(error: unknown) {
  if (error instanceof MetaPublishError) return error.message;
  return graphErrorMessage(error) ?? "Failed to publish to Instagram";
}

export type PublishResult = { status: "posted" } | { status: "processing"; containerId: string; instagramId: string; token: string } | { status: "failed"; reason: string };

/**
 * Publishes an image to Instagram. Creates the media container and does a short
 * bounded poll (well under a serverless function's time limit) for it to finish
 * processing. If it isn't ready in time, returns "processing" so the caller can
 * let the scheduled-publish cron route finish the job instead of blocking.
 */
export async function publishToInstagram(token: string, imageUrl: string, caption: string): Promise<PublishResult> {
  try {
    const { instagramId } = await findInstagramAccount(token);
    const containerId = await createMediaContainer(instagramId, token, imageUrl, caption);

    const MAX_ATTEMPTS = 6;
    const POLL_INTERVAL_MS = 1500;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const status = await getContainerStatus(containerId, token);
      if (status === "FINISHED") {
        await publishContainer(instagramId, token, containerId);
        return { status: "posted" };
      }
      if (status === "ERROR") {
        return { status: "failed", reason: "Instagram failed to process the media" };
      }
      await sleep(POLL_INTERVAL_MS);
    }

    return { status: "processing", containerId, instagramId, token };
  } catch (error) {
    return { status: "failed", reason: publishFailureReason(error) };
  }
}

/** Finishes publishing a media container that was still processing when the initial request timed out. */
export async function finishPendingPublish(instagramId: string, token: string, containerId: string): Promise<PublishResult> {
  try {
    const status = await getContainerStatus(containerId, token);
    if (status === "FINISHED") {
      await publishContainer(instagramId, token, containerId);
      return { status: "posted" };
    }
    if (status === "ERROR") {
      return { status: "failed", reason: "Instagram failed to process the media" };
    }
    return { status: "processing", containerId, instagramId, token };
  } catch (error) {
    return { status: "failed", reason: publishFailureReason(error) };
  }
}
