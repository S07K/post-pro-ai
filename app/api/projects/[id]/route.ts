import { connectDB } from "@/lib/db/mongoose";
import Project from "@/lib/db/models/project";
import Post from "@/lib/db/models/post";
import { updateProjectSchema } from "@/lib/validation/project";
import { isFacebookTokenValid } from "@/lib/meta";
import { requireUserId } from "@/lib/api/session";
import { ok, unauthorized, forbidden, notFound, validationError, serverError } from "@/lib/api/respond";

async function loadOwnedProject(id: string, userId: string) {
  const project = await Project.findById(id);
  if (!project) return { project: null, error: notFound("Project not found") };
  if (project.userId !== userId) return { project: null, error: forbidden() };
  return { project, error: null };
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return unauthorized();
    }

    await connectDB();
    const { project, error } = await loadOwnedProject(params.id, userId);
    if (error) return error;

    let facebookConnected = project!.connections.facebook.isEnabled;
    if (facebookConnected) {
      facebookConnected = await isFacebookTokenValid(project!.connections.facebook.token);
      if (!facebookConnected) {
        project!.connections.facebook = { isEnabled: false, token: "" };
        await project!.save();
      }
    }

    return ok({
      status: "success",
      project: {
        id: project!._id,
        title: project!.title,
        description: project!.description,
        captionLimit: project!.captionLimit,
        postLimit: project!.postLimit,
        hashtags: project!.hashtags,
        connections: { facebook: facebookConnected },
      },
    });
  } catch (error) {
    return serverError(error, "Failed to load project");
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return unauthorized();
    }

    const parsed = updateProjectSchema.safeParse(await req.json());
    if (!parsed.success) {
      return validationError(parsed.error);
    }

    await connectDB();
    const { project, error } = await loadOwnedProject(params.id, userId);
    if (error) return error;

    const { connections, ...rest } = parsed.data;
    Object.assign(project!, rest);
    if (connections?.facebook === false) {
      project!.connections.facebook = { isEnabled: false, token: "" };
    }
    await project!.save();

    return ok({
      status: "success",
      project: {
        id: project!._id,
        title: project!.title,
        description: project!.description,
        connections: { facebook: project!.connections.facebook.isEnabled },
      },
    });
  } catch (error) {
    return serverError(error, "Failed to update project");
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return unauthorized();
    }

    await connectDB();
    const { project, error } = await loadOwnedProject(params.id, userId);
    if (error) return error;

    await Post.deleteMany({ projectId: project!._id.toString() });
    await project!.deleteOne();
    return ok({ status: "success", message: "Project deleted successfully" });
  } catch (error) {
    return serverError(error, "Failed to delete project");
  }
}
