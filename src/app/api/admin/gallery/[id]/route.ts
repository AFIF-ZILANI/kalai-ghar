import { NextRequest, NextResponse } from "next/server";
import { readGallery, writeGallery } from "@/lib/server/gallery";
import fs from "fs";
import path from "path";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Params) {
    const { id } = await params;
    const body = await request.json();
    const items = readGallery();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    items[idx] = { ...items[idx], ...body, id };
    writeGallery(items);
    return NextResponse.json(items[idx]);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
    const { id } = await params;
    const items = readGallery();
    const item = items.find((i) => i.id === id);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Remove local file if it's a local upload
    if (item.src.startsWith("/images/gallery/")) {
        const filePath = path.join(process.cwd(), "public", item.src);
        try {
            fs.unlinkSync(filePath);
        } catch {
            // File may already be gone
        }
    }

    const updated = items.filter((i) => i.id !== id).map((i, idx) => ({ ...i, order: idx }));
    writeGallery(updated);
    return NextResponse.json({ ok: true });
}
