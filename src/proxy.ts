import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "../i18n/routing";
import { COOKIE_NAME, verifyToken } from "@/lib/server/auth";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Admin auth — runs before i18n so locale detection never touches /admin
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
        const isPublic =
            pathname === "/admin/login" || pathname.startsWith("/api/admin/auth");

        if (!isPublic) {
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

    // i18n locale routing for all public pages
    return intlMiddleware(request);
}

export const config = {
    matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
