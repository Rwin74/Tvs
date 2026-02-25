import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// PUT: Update category
export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await req.json();

        const category = await db.category.update({
            where: { id },
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                imageUrl: body.imageUrl,
                iconClass: body.iconClass,
            },
        });

        return NextResponse.json(category);
    } catch (error: any) {
        console.error("Failed to update category:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

// DELETE: Remove category
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        // Check if any products are using this category
        const productCount = await db.product.count({
            where: { categoryId: id }
        });

        if (productCount > 0) {
            return NextResponse.json(
                { error: `Bu kategoriye bağlı ${productCount} ürün var. Önce ürünlerin kategorisini değiştirin.` },
                { status: 400 }
            );
        }

        await db.category.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Failed to delete category:", error);
        return NextResponse.json(
            { error: error.message || "Silme işlemi başarısız" },
            { status: 500 }
        );
    }
}


// GET: Single category
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const category = await db.category.findUnique({ where: { id } });
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
