import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongoose";
import User from "@/lib/db/models/user";
import { loginSchema } from "@/lib/validation/auth";

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }
        const { email, password } = parsed.data;

        await connectDB();
        // Case-insensitive match: accounts created by the old Express backend weren't lowercased
        const user = await User.findOne({ email }).collation({ locale: "en", strength: 2 });
        if (!user) {
          console.warn("[auth] sign-in failed: no user with that email in database", User.db.name);
          return null;
        }

        if (!/^\$2[aby]\$/.test(user.password)) {
          console.warn("[auth] sign-in failed: stored password is not a bcrypt hash");
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          console.warn("[auth] sign-in failed: password does not match");
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username || user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
