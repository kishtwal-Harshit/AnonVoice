import { NextResponse, NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    // Fetch the token
    const token = await getToken({ req: request });
    // Get url of request
    const url = request.nextUrl;

    // For now, let's just handle the protected routes
    // Remove the redirect for authenticated users until dashboard is ready
    
    // If user doesn't have token and tries to access protected routes, redirect to sign-in
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Allow authenticated users to access auth pages for now
    // You can uncomment this later when dashboard is ready:
    /*
    if (token && 
        (
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/verify') ||
            url.pathname === '/'
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    */

    return NextResponse.next();
}

// Mention all endpoints where middleware should run
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
}