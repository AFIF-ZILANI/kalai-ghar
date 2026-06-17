export const COOKIE_NAME = "kg_admin_token";

async function computeToken(password: string): Promise<string> {
    const secret = process.env.ADMIN_SECRET ?? "kalai-ghor-default-secret";
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, enc.encode(password));
    return Array.from(new Uint8Array(sig))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export async function createToken(): Promise<string> {
    const password = process.env.ADMIN_PASSWORD ?? "admin123";
    return computeToken(password);
}

export async function verifyToken(token: string | undefined): Promise<boolean> {
    if (!token) return false;
    const expected = await createToken();
    return token === expected;
}

export async function checkPassword(input: string): Promise<boolean> {
    const password = process.env.ADMIN_PASSWORD ?? "admin123";
    return input === password;
}
