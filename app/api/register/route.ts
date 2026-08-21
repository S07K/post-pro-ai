import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/user";
import { registerSchema } from "@/lib/validation/auth";
import { ok, fail, validationError, serverError } from "@/lib/api/respond";

const SALT_ROUNDS = 12;

export async function POST(req: Request) {
  try {
    const parsed = registerSchema.safeParse(await req.json());
    if (!parsed.success) {
      return validationError(parsed.error);
    }
    const { email, password } = parsed.data;

    await connectDB();
    const existing = await User.findOne({ email });
    if (existing) {
      return fail("An account with this email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ email, password: hashedPassword });

    return ok({ status: "success", message: "Account created successfully", data: { email: user.email } });
  } catch (error) {
    return serverError(error, "Failed to create account");
  }
}
