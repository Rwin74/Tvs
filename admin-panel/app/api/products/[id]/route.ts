import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { z } from "zod";

// Schema for input validation (matching the form)
const productUpdateSchema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
    shortDescription: z.string().optional(),
    htmlDescription: z.string().optional(),
    gsm: z.union([z.string(), z.number()]).optional().transform(v => v ? Number(v) : undefined),
    fabricType: z.string().optional(),
    basePrice: z.union([z.string(), z.number()]).transform(v => Number(v)),
    categoryId: z.string().min(2, "Kategori seçimi zorunludur").optional(),
    // SEO
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
});

// GET: Fetch single product
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const product = await db.product.findUnique({
            where: { id: id },
            include: {
                variants: true,
                media: true,
                seo: true
            }
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PUT: Update product
export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await req.json();

        // Basic validation
        const validation = productUpdateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
        }

        const data = body;

        // Transaction to handle updates securely
        // For variants: Delete all and recreate is simplest for this scale
        // Or complex upsert. Let's do delete-create for 'variants' to ensure sync
        // For media: Append is easy, but if we want to sync, we might need logic. 
        // For now, let's assume media additions are handled in the specific logic or we just create new ones linked.

        // Clean update
        await db.productVariant.deleteMany({ where: { productId: id } });

        const product = await db.product.update({
            where: { id: id },
            data: {
                name: data.name,
                slug: data.slug,
                shortDescription: data.shortDescription,
                gsm: data.gsm ? Number(data.gsm) : null,
                fabricType: data.fabricType,
                basePrice: data.basePrice ? Number(data.basePrice) : 0,
                categoryId: data.categoryId,
                isActive: true, // or from data

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
                },

                // Re-create variants
                variants: {
                    create: data.variants?.map((v: any) => ({
                        sku: v.sku || `${data.slug}-${v.color || 'def'}-${v.size || 'def'}-${Date.now()}`, // Ensure unique SKU if collision
                        colorCode: v.color,
                        size: v.size,
                        stockQuantity: Number(v.stock) || 0,
                        priceOverride: v.price ? Number(v.price) : null
                    }))
                },

                // Media - typically we don't delete old media on simple update unless specified
                // If data.images contains NEW images, we create them. 
                // If we want to sync exact reference, we need logic. 
                // For now, let's just ADD new ones if they are sent as objects or URL strings that are NOT in DB? 
                // Actually, the frontend sends `images` array of URLs.
                // Simplification: We won't delete existing media here to prevent data loss. 
                // We will just add new ones if they are passed. 
                // Better: The frontend logic handles upload separately.
                // If we want to "Link" new uploaded images:
                media: {
                    create: data.newImages?.map((url: string) => ({
                        fileName: url.split('/').pop() || 'image',
                        filePath: url,
                        altText: data.name,
                        sizeKb: 0
                    }))
                }
            },
            include: { variants: true, media: true }
        });

        return NextResponse.json(product);
    } catch (error: any) {
        console.error("Update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Remove product
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        await db.product.delete({
            where: { id: id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
