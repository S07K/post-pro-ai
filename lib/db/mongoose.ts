import mongoose, { type ConnectOptions } from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/postproai";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Reuse the connection across hot reloads / serverless invocations instead of
// opening a new one per request.
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cache;

/**
 * Builds the driver options for connecting. When MONGO_USER and MONGO_PASSWORD
 * are both set they are passed as `auth`, so the password never has to be
 * URL-encoded into MONGO_URI. Otherwise MONGO_URI is used as-is, which keeps a
 * URI with inline credentials (and local dev without auth) working.
 */
export function mongoConnectOptions(env: Record<string, string | undefined> = process.env): ConnectOptions {
  const options: ConnectOptions = {
    // Fail within 5s instead of hanging until the serverless function times out
    serverSelectionTimeoutMS: 5000,
  };
  if (env.MONGO_USER && env.MONGO_PASSWORD) {
    options.auth = { username: env.MONGO_USER, password: env.MONGO_PASSWORD };
  }
  return options;
}

export async function connectDB() {
  if (cache.conn) {
    return cache.conn;
  }
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGO_URI, mongoConnectOptions());
  }
  try {
    cache.conn = await cache.promise;
  } catch (error) {
    // Don't keep returning a failed attempt; let the next request retry
    cache.promise = null;
    throw error;
  }
  return cache.conn;
}
