import { NextRequest, NextResponse } from "next/server";
import { getContactData, writeContactData } from "@/lib/server/contact";

export async function GET() {
    return NextResponse.json(getContactData());
}

export async function PUT(request: NextRequest) {
    const body = await request.json();
    writeContactData(body);
    return NextResponse.json(getContactData());
}
