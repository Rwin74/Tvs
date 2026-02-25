import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Get the path
    const path = request.nextUrl.pathname;

    // Public paths that do not require authentication
    // Note: these are paths WITHIN the basePath (/admin), so /login = /admin/login
    const isPublicPath = path === "/admin/login" ||
        path.startsWith("/admin/api/products") ||
        path.startsWith("/admin/api/auth");

    // Get the token from cookies
    const token = request.cookies.get("admin_token")?.value;

    // Protect dashboard routes
    if (!isPublicPath && !token) {
        // Redirect unauthenticated users to login page
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Redirect authenticated users away from login page
    if (path === "/admin/login" && token) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
}

// Config to specify which paths the middleware should apply to
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
