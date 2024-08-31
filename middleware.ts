import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const middleware = async (req: NextRequest) => {
    const token = cookies().get("postproai-token")?.value;
    // console.log('Token: ', token);
    if (!token && !req.nextUrl.pathname.includes('/login') && !req.nextUrl.pathname.includes('/register')) {
        // console.log('Redirecting to login', req.nextUrl?.origin);   
        return NextResponse.redirect(new URL("/login", req.nextUrl?.origin));
    } else {
        return NextResponse.next();
    }
}
export const config = {
    matcher: ['/', '/dashboard/:path*', '/api/:path*', '/projects/:path*'],
}