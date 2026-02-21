import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const file: File | null = data.get("file") as unknown as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validate file type (Only images)
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: "Sadece resim dosyaları yüklenebilir" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create uploads directory if not exists
        const uploadDir = join(process.cwd(), "public", "uploads");
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Ignore error if exists
        }

        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = file.name.replace(/[^a-zA-Z0-9.]/g, "-");
        const uniqueFilename = `${uniqueSuffix}-${filename}`;
        const path = join(uploadDir, uniqueFilename);

        await writeFile(path, buffer);
        console.log(`Open ${path} to see the uploaded file`);

        return NextResponse.json({
            url: `/uploads/${uniqueFilename}`,
            filename: uniqueFilename,
            size: file.size,
            type: file.type
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
