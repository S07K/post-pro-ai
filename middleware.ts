import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    if (req.nextUrl.pathname.startsWith("/api") && !req.nextauth.token) {
      return NextResponse.json({ status: "error", message: "Authentication required" }, { status: 401 });
    }
    return NextResponse.next();
  },
  {
    pages: { signIn: "/login" },
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/projects/:path*",
    "/api/projects/:path*",
    "/api/posts/:path*",
    "/api/openai/:path*",
    "/api/user/:path*",
    "/api/analytics/:path*",
  ],
};
