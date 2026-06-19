import { NextRequest, NextResponse } from "next/server";
import { readMenu, writeMenu, MenuItem } from "@/lib/server/menu";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json() as Partial<MenuItem>;
    const items = readMenu();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    items[idx] = { ...items[idx], ...body, id };
    writeMenu(items);
    return NextResponse.json(items[idx]);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const items = readMenu();
    const filtered = items.filter((i) => i.id !== id).map((item, idx) => ({ ...item, order: idx }));
    if (filtered.length === items.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    writeMenu(filtered);
    return NextResponse.json({ ok: true });
}
