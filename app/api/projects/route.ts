import { connectDB } from "@/lib/db/mongoose";
import Project from "@/lib/db/models/project";
import { createProjectSchema } from "@/lib/validation/project";
import { requireUserId } from "@/lib/api/session";
import { ok, unauthorized, fail, validationError, serverError } from "@/lib/api/respond";

export async function GET() {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return unauthorized();
    }

    await connectDB();
    const projects = await Project.find({ userId }).sort({ createdAt: -1 });
    return ok({ status: "success", projects });
  } catch (error) {
    return serverError(error, "Failed to load projects");
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return unauthorized();
    }

    const parsed = createProjectSchema.safeParse(await req.json());
    if (!parsed.success) {
      return validationError(parsed.error);
    }

    await connectDB();
    const existing = await Project.findOne({ userId, title: parsed.data.title });
    if (existing) {
      return fail("A project with this title already exists", 409);
    }

    const project = await Project.create({ ...parsed.data, userId });
    return ok({ status: "success", project });
  } catch (error) {
    return serverError(error, "Failed to create project");
  }
}
