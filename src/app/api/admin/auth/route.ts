import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createToken, COOKIE_NAME } from "@/lib/server/auth";
import { checkRateLimit, recordFailure, recordSuccess } from "@/lib/server/rate-limit";

function getIp(request: NextRequest): string {
    return (
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
        request.headers.get("x-real-ip") ??
        "unknown"
    );
}

export async function POST(request: NextRequest) {
    const ip = getIp(request);

    // Check if IP is currently locked out
    const limitCheck = checkRateLimit(ip);
    if (!limitCheck.allowed) {
        return NextResponse.json(
            { error: `Too many attempts. Try again in ${Math.ceil(limitCheck.retryAfterSeconds / 60)} minutes.` },
            { status: 429, headers: { "Retry-After": String(limitCheck.retryAfterSeconds) } }
        );
    }

    const { password } = await request.json();
    const ok = await checkPassword(password);

    if (!ok) {
        const result = recordFailure(ip);
        const message = result.allowed
            ? "Invalid password."
            : `Too many failed attempts. Locked out for ${Math.ceil(result.retryAfterSeconds / 60)} minutes.`;
        return NextResponse.json({ error: message }, { status: 401 });
    }

    recordSuccess(ip);
    const token = await createToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        secure: process.env.NODE_ENV === "production",
    });
    return response;
}

export async function DELETE() {
    const response = NextResponse.json({ ok: true });
    response.cookies.delete(COOKIE_NAME);
    return response;
}
