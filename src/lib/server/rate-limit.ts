// In-memory store: ip → { count, firstAttempt }
// Allows MAX_ATTEMPTS failed logins per WINDOW_MS before locking out for LOCKOUT_MS.
const store = new Map<string, { count: number; firstAttempt: number; lockedUntil?: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;   // 10 minutes
const LOCKOUT_MS = 30 * 60 * 1000;  // 30 minutes

export type RateLimitResult =
    | { allowed: true }
    | { allowed: false; retryAfterSeconds: number };

export function checkRateLimit(ip: string): RateLimitResult {
    const now = Date.now();
    const entry = store.get(ip);

    if (entry?.lockedUntil) {
        if (now < entry.lockedUntil) {
            return { allowed: false, retryAfterSeconds: Math.ceil((entry.lockedUntil - now) / 1000) };
        }
        // Lockout expired — reset
        store.delete(ip);
    }

    return { allowed: true };
}

export function recordFailure(ip: string): RateLimitResult {
    const now = Date.now();
    const entry = store.get(ip);

    if (!entry || now - entry.firstAttempt > WINDOW_MS) {
        store.set(ip, { count: 1, firstAttempt: now });
        return { allowed: true };
    }

    entry.count += 1;

    if (entry.count >= MAX_ATTEMPTS) {
        entry.lockedUntil = now + LOCKOUT_MS;
        return { allowed: false, retryAfterSeconds: Math.ceil(LOCKOUT_MS / 1000) };
    }

    return { allowed: true };
}

export function recordSuccess(ip: string): void {
    store.delete(ip);
}
