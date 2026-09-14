import { connectDB } from "@/lib/db/mongoose";
import Project from "@/lib/db/models/project";
import { setAccessSchema } from "@/lib/validation/project";
import { exchangeForLongLivedToken, verifyInstagramConnection, MetaPublishError } from "@/lib/meta";
import { requireUserId } from "@/lib/api/session";
import { ok, fail, unauthorized, forbidden, notFound, validationError, serverError } from "@/lib/api/respond";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return unauthorized();
    }

    const parsed = setAccessSchema.safeParse(await req.json());
    if (!parsed.success) {
      return validationError(parsed.error);
    }

    await connectDB();
    const project = await Project.findById(params.id);
    if (!project) return notFound("Project not found");
    if (project.userId !== userId) return forbidden();

    const longLivedToken = await exchangeForLongLivedToken(parsed.data.token);

    // Only mark the project connected if the token can actually publish to Instagram
    let pageName = "";
    try {
      ({ pageName } = await verifyInstagramConnection(longLivedToken));
    } catch (error) {
      if (error instanceof MetaPublishError) {
        return fail(error.message, 422);
      }
      throw error;
    }

    project.connections.facebook = { isEnabled: true, token: longLivedToken };
    await project.save();

    return ok({ status: "success", connection: "facebook", pageName });
  } catch (error) {
    return serverError(error, "Failed to connect Instagram");
  }
}
