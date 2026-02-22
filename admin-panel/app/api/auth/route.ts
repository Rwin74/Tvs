import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (email === "tvs@gmail.com" && password === "tvs2026") {
            // Basic secure cookie
            const response = NextResponse.json({ success: true });
            response.cookies.set("admin_token", "authenticated", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 1 week
            });
            return response;
        }

        return NextResponse.json({ error: "E-posta veya şifre hatalı." }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    // Logout
    const response = NextResponse.json({ success: true });
    response.cookies.delete("admin_token");
    return response;
}
