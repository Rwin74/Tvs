import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
    try {
        const [productCount, postCount, quoteCount] = await Promise.all([
            db.product.count(),
            db.blogPost.count(),
            db.quoteRequest.count({ where: { status: "Pending" } }),
        ]);

        return NextResponse.json({
            products: productCount,
            posts: postCount,
            pendingQuotes: quoteCount,
        });
    } catch (error) {
        console.error("Stats error:", error);
        return NextResponse.json({ products: 0, posts: 0, pendingQuotes: 0 });
    }
}
