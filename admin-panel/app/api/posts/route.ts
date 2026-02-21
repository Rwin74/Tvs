import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { z } from "zod";

// Schema for input validation
const postCreateSchema = z.object({
    title: z.string().min(2),
    slug: z.string().min(2),
    content: z.string().optional(),
    status: z.enum(["Draft", "Published"]).default("Draft"),
    // SEO
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
});

export async function GET(req: NextRequest) {
    try {
        const posts = await db.blogPost.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                seo: true,
            }
        });
        return NextResponse.json(posts);
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Basic validation
        const validation = postCreateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
        }

        const data = body;

        const post = await db.blogPost.create({
            data: {
                title: data.title,
                slug: data.slug,
                content: data.content,
                status: data.status || "Draft",
                publishedAt: data.status === "Published" ? new Date() : null,

                // SEO Relation
                seo: {
                    create: {
                        metaTitle: data.metaTitle,
                        metaDescription: data.metaDescription
                    }
                },
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error: any) {
        console.error("Failed to create post:", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
