import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const categories = await db.category.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body.name || !body.slug) {
            return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
        }

        const category = await db.category.create({
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                imageUrl: body.imageUrl,
                iconClass: body.iconClass || "fas fa-box"
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
        console.error("Failed to create category:", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
