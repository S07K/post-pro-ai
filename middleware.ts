import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const middleware = async (req: NextRequest) => {
    const token = cookies().get("postproai-token")?.value;
    if (!token && !req.nextUrl.pathname.includes('/login') && !req.nextUrl.pathname.includes('/register')) {
        return NextResponse.redirect(new URL("/login", req.url));
    } else {
        return NextResponse.next();
    }
}
export const config = {
    matcher: ['/dashboard/:path*', '/api/:path*', '/projects/:path*'],
}