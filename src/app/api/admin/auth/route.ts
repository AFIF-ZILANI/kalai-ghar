import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createToken, COOKIE_NAME } from "@/lib/server/auth";

export async function POST(request: NextRequest) {
    const { password } = await request.json();
    const ok = await checkPassword(password);
    if (!ok) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    const token = await createToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        secure: process.env.NODE_ENV === "production",
    });
    return response;
}

export async function DELETE() {
    const response = NextResponse.json({ ok: true });
    response.cookies.delete(COOKIE_NAME);
    return response;
}
