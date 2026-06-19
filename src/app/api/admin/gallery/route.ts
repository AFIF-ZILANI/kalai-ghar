import { NextRequest, NextResponse } from "next/server";
import { readGallery, writeGallery, GalleryItem } from "@/lib/server/gallery";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export async function GET() {
    return NextResponse.json(readGallery());
}

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const altBn = (formData.get("altBn") as string) ?? "";
    const altEn = (formData.get("altEn") as string) ?? "";
    const captionBn = (formData.get("captionBn") as string) ?? "";
    const captionEn = (formData.get("captionEn") as string) ?? "";
    const aspect = (formData.get("aspect") as GalleryItem["aspect"]) ?? "landscape";
    const category = (formData.get("category") as GalleryItem["category"]) ?? undefined;

    const items = readGallery();
    const id = randomUUID();

    let src: string;
    if (file && file.size > 0) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const filename = `${id}.${ext}`;
        const destDir = path.join(process.cwd(), "public", "images", "gallery");
        fs.mkdirSync(destDir, { recursive: true });
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(path.join(destDir, filename), buffer);
        src = `/images/gallery/${filename}`;
    } else {
        const externalSrc = (formData.get("src") as string) ?? "";
        if (!externalSrc) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }
        src = externalSrc;
    }

    const newItem: GalleryItem = {
        id,
        src,
        altBn,
        altEn,
        captionBn,
        captionEn,
        aspect,
        ...(category && { category }),
        order: items.length,
    };
    items.push(newItem);
    writeGallery(items);
    return NextResponse.json(newItem, { status: 201 });
}
