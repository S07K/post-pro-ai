import { MongoMemoryServer } from "mongodb-memory-server";

export default async function globalSetup() {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri("postproai_test");
  process.env.NEXTAUTH_SECRET = "test-secret";
  process.env.CRON_SECRET = "test-cron-secret";

  return async () => {
    await mongod.stop();
  };
}
