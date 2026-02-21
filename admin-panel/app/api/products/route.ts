import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { z } from "zod";

// Schema for input validation (matching the form)
const productCreateSchema = z.object({
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

export async function GET(req: NextRequest) {
    try {
        const products = await db.product.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                variants: true,
            }
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Basic validation
        const validation = productCreateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
        }

        const data = body;

        const product = await db.product.create({
            data: {
                name: data.name,
                slug: data.slug,
                shortDescription: data.shortDescription,
                gsm: data.gsm ? Number(data.gsm) : null,
                fabricType: data.fabricType,
                basePrice: data.basePrice ? Number(data.basePrice) : 0,
                categoryId: data.categoryId,

                // SEO Relation
                seo: {
                    create: {
                        metaTitle: data.metaTitle,
                        metaDescription: data.metaDescription
                    }
                },

                // Variants (Handling the array if present)
                variants: {
                    create: data.variants?.map((v: any) => ({
                        sku: v.sku || `${data.slug}-${v.color || 'def'}-${v.size || 'def'}`,
                        colorCode: v.color,
                        size: v.size,
                        stockQuantity: Number(v.stock) || 0,
                        priceOverride: v.price ? Number(v.price) : null
                    }))
                },

                // Media Relation
                media: {
                    create: data.images?.map((url: string) => ({
                        fileName: url.split('/').pop() || 'image',
                        filePath: url,
                        altText: data.name,
                        sizeKb: 0
                    }))
                }
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        console.error("Failed to create product:", error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
