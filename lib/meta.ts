import axios from "axios";

const FACEBOOK_API_ENDPOINT = process.env.FACEBOOK_API_ENDPOINT || "https://graph.facebook.com/v20.0";
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || "";
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || "";

export class MetaPublishError extends Error {}

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
  } catch {
    return token;
  }
}

async function getInstagramBusinessAccountId(token: string): Promise<string> {
  const params = { access_token: token };
  const pagesResponse = await axios.get(`${FACEBOOK_API_ENDPOINT}/me/accounts`, { params });
  const pageId = pagesResponse.data?.data?.[0]?.id;
  if (!pageId) {
    throw new MetaPublishError("No connected Facebook page found");
  }

  const pageResponse = await axios.get(`${FACEBOOK_API_ENDPOINT}/${pageId}`, {
    params: { ...params, fields: "instagram_business_account" },
  });
  const instagramId = pageResponse.data?.instagram_business_account?.id;
  if (!instagramId) {
    throw new MetaPublishError("No Instagram business account connected to this Facebook page");
  }
  return instagramId;
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

export type PublishResult = { status: "posted" } | { status: "processing"; containerId: string; instagramId: string; token: string } | { status: "failed"; reason: string };

/**
 * Publishes an image to Instagram. Creates the media container and does a short
 * bounded poll (well under a serverless function's time limit) for it to finish
 * processing. If it isn't ready in time, returns "processing" so the caller can
 * let the scheduled-publish cron route finish the job instead of blocking.
 */
export async function publishToInstagram(token: string, imageUrl: string, caption: string): Promise<PublishResult> {
  try {
    const instagramId = await getInstagramBusinessAccountId(token);
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
    const reason = error instanceof MetaPublishError ? error.message : "Failed to publish to Instagram";
    return { status: "failed", reason };
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
    const reason = error instanceof MetaPublishError ? error.message : "Failed to publish to Instagram";
    return { status: "failed", reason };
  }
}
