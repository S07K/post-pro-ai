import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    pages: { signIn: "/login" },
    callbacks: {
      authorized: ({ req, token }) => {
        // For API routes, let the request through even without a session so the
        // route handler can return a proper 401 JSON body instead of an HTML
        // redirect (which is what withAuth does by default on failure).
        if (req.nextUrl.pathname.startsWith("/api")) {
          return true;
        }
        return !!token;
      },
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
