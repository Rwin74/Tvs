import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { z } from "zod";

const postUpdateSchema = z.object({
    title: z.string().min(2),
    slug: z.string().min(2),
    content: z.string().optional(),
    status: z.enum(["Draft", "Published"]).default("Draft"),
    // SEO
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
});

// GET: Fetch single post
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } // or { params: { id: string } } depending on next config, often it needs any or Promise
) {
    try {
        const { id } = await context.params;
        const post = await db.blogPost.findUnique({
            where: { id: id },
            include: {
                seo: true
            }
        });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PUT: Update post
export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await req.json();

        const validation = postUpdateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
        }

        const data = body;

        const post = await db.blogPost.update({
            where: { id: id },
            data: {
                title: data.title,
                slug: data.slug,
                content: data.content,
                status: data.status || "Draft",
                publishedAt: data.status === "Published" ? new Date() : null, // Assuming republish updates date, adjust as needed

                // Update SEO
                seo: {
                    upsert: {
                        create: {
                            metaTitle: data.metaTitle,
                            metaDescription: data.metaDescription
                        },
                        update: {
                            metaTitle: data.metaTitle,
                            metaDescription: data.metaDescription
                        }
                    }
                }
            },
            include: { seo: true }
        });

        return NextResponse.json(post);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
        }
        console.error("Update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Remove post
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        await db.blogPost.delete({
            where: { id: id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
