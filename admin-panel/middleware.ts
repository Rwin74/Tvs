import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Admin panel artık kendi subdomain'inde (admin.tvstekstil.com)
    // basePath yok — tüm path'ler root'tan başlıyor
    const isPublicPath =
        path === "/login" ||
        path.startsWith("/api/products") ||
        path.startsWith("/api/auth");

    const token = request.cookies.get("admin_token")?.value;

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (path === "/login" && token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
