import { NextRequest, NextResponse } from "next/server";
import { readGallery, writeGallery } from "@/lib/server/gallery";

export async function PUT(request: NextRequest) {
    const { ids } = await request.json() as { ids: string[] };
    if (!Array.isArray(ids)) {
        return NextResponse.json({ error: "ids must be an array" }, { status: 400 });
    }
    const items = readGallery();
    const byId = Object.fromEntries(items.map((i) => [i.id, i]));

    const reordered = ids
        .filter((id) => byId[id])
        .map((id, idx) => ({ ...byId[id], order: idx }));

    // Append any items not in the ids list at the end (defensive)
    const included = new Set(ids);
    const remaining = items.filter((i) => !included.has(i.id)).map((i, j) => ({
        ...i,
        order: reordered.length + j,
    }));

    writeGallery([...reordered, ...remaining]);
    return NextResponse.json({ ok: true });
}
