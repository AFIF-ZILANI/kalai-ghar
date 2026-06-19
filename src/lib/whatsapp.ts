/**
 * Normalize any Bangladeshi phone number to the E.164-ish format wa.me expects.
 * Handles: 01XXXXXXXXX  →  8801XXXXXXXXX
 *          +880...      →  880...
 *          880...       →  880...  (already correct)
 */
export function toWaNumber(raw: string): string {
    const digits = raw.replace(/[\s\-().+]/g, "");
    if (digits.startsWith("0")) return "880" + digits.slice(1);
    return digits;
}
