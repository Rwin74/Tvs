import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { z } from "zod";

// Schema for validation
const quoteSchema = z.object({
    customerName: z.string().min(2),
    companyName: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    items: z.string().optional(), // JSON string or simple text for now
    notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
    try {
        const quotes = await db.quoteRequest.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(quotes);
    } catch (error) {
        console.error("Failed to fetch quotes:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Basic validation
        const validation = quoteSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
        }
        const data = body;

        const quote = await db.quoteRequest.create({
            data: {
                customerName: data.customerName,
                companyName: data.companyName,
                email: data.email,
                phone: data.phone,
                items: data.items ? JSON.stringify(data.items) : null,
                notes: data.notes,
                status: "Pending"
            },
        });

        return NextResponse.json(quote, { status: 201 });
    } catch (error: any) {
        console.error("Failed to create quote:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
