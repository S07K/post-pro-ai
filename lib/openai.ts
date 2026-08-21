import axios from "axios";
import { uploadImage } from "@/lib/storage/firebase";

const OPENAI_API_URL = "https://api.openai.com/v1/images/generations";

export class OpenAIGenerationError extends Error {}

/** Generates an image with DALL-E-3 for the given prompt and uploads it to Firebase Storage. Returns the public image URL. */
export async function generatePostImage(prompt: string, projectId: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new OpenAIGenerationError("OPENAI_API_KEY is not configured on the server");
  }

  let b64Image: string;
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "dall-e-3",
        prompt,
        size: "1024x1024",
        n: 1,
        response_format: "b64_json",
      },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    b64Image = response.data?.data?.[0]?.b64_json;
    if (!b64Image) {
      throw new OpenAIGenerationError("OpenAI returned no image data");
    }
  } catch (error) {
    if (error instanceof OpenAIGenerationError) throw error;
    throw new OpenAIGenerationError("Failed to generate image with OpenAI");
  }

  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`;
  const buffer = Buffer.from(b64Image, "base64");
  return uploadImage(uniqueName, buffer, `PostProAI/${projectId}`);
}
