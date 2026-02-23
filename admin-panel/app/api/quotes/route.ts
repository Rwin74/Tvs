import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { z } from "zod";

const quoteSchema = z.object({
    customerName: z.string().min(2),
    companyName: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    items: z.string().optional(), // Can be stringified JSON or plain text
    notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
    try {
        const quotes = await db.quoteRequest.findMany({
            orderBy: { createdAt: 'desc' }
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
        const validation = quoteSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.flatten() }, { status: 400 });
        }

        const quote = await db.quoteRequest.create({
            data: validation.data
        });

        return NextResponse.json({ success: true, quote }, { status: 201 });
    } catch (error: any) {
        console.error("Failed to submit quote:", error);
        return NextResponse.json({ error: "İşlem sırasında bir hata oluştu" }, { status: 500 });
    }
}
