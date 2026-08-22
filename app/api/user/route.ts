import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/user";
import { requireUserId } from "@/lib/api/session";
import { ok, unauthorized, notFound, serverError } from "@/lib/api/respond";

export async function GET() {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return unauthorized();
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return notFound("User not found");
    }

    return ok({
      status: "success",
      user: {
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio,
        verified: user.verified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return serverError(error, "Failed to load user");
  }
}
