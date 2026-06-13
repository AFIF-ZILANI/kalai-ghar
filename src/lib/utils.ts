/** Convert Western Arabic numerals to Eastern Arabic (Bengali) numerals */
export function toBengaliNumerals(n: number | string): string {
    const map: Record<string, string> = {
        "0": "০",
        "1": "১",
        "2": "২",
        "3": "৩",
        "4": "৪",
        "5": "৫",
        "6": "৬",
        "7": "৭",
        "8": "৮",
        "9": "৯",
    };
    return String(n).replace(/[0-9]/g, (d) => map[d]);
}

/** Format a price for a given locale */
export function formatPrice(price: number | null, locale: string): string {
    if (price === null) return "";
    if (locale === "bn") return `${toBengaliNumerals(price)}৳`;
    return `৳${price}`;
}
