import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifyToken } from "@/lib/server/auth";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === "/admin/login" || pathname.startsWith("/api/admin/auth")) {
        return NextResponse.next();
    }

    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
        const token = request.cookies.get(COOKIE_NAME)?.value;
        const valid = await verifyToken(token);
        if (!valid) {
            if (pathname.startsWith("/api/")) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};
