import { afterAll, afterEach } from "vitest";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongoose";

afterEach(async () => {
  await connectDB();
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});
