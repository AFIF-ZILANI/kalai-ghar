import { NextRequest, NextResponse } from "next/server";
import { readMenu, writeMenu, MenuItem } from "@/lib/server/menu";
import { randomUUID } from "crypto";

export async function GET() {
    return NextResponse.json(readMenu());
}

export async function POST(request: NextRequest) {
    const body = await request.json() as Omit<MenuItem, "id" | "order">;
    const items = readMenu();
    const newItem: MenuItem = {
        ...body,
        id: randomUUID(),
        order: items.length,
    };
    writeMenu([...items, newItem]);
    return NextResponse.json(newItem, { status: 201 });
}
