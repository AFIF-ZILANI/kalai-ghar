/**
 * OWNER-EDITABLE site configuration.
 * No code changes required for these values — edit this file directly.
 */

export const siteConfig = {
    // Business identity
    name: "Kalai Ghor",
    nameBn: "কালাই ঘর",
    tagline: "Heritage Kalai Ruti of Rajshahi",
    taglineBn: "রাজশাহীর ঐতিহ্যবাহী কালাই রুটি",

    // TODO: Confirm exact address with owner
    address: {
        street: "Uposhohor", // TODO: exact street/plot number
        area: "Uposhohor",
        city: "Rajshahi",
        country: "Bangladesh",
        // Dhaka outlet
        dhakaStreet: "TODO: Dhaka outlet address",
    },

    // TODO: Confirm geo coordinates
    geo: {
        lat: 24.3745, // approximate Rajshahi city center
        lng: 88.6042,
    },

    // TODO: Replace with real phone number
    phone: "TODO_PHONE_NUMBER",
    // TODO: Replace with real WhatsApp number (without +, e.g. "8801XXXXXXXXX")
    whatsapp: "TODO_WHATSAPP_NUMBER",

    // Google Maps
    // Replace googleMapsEmbedUrl with the embed URL from Google Maps (Share → Embed a map → copy src).
    // Current: approximate area embed using search query — works without an API key.
    // When the exact address is confirmed, generate a precise embed URL from Google Maps.
    googleMapsEmbedUrl:
        "https://maps.google.com/maps?q=Uposhohor,+Rajshahi,+Bangladesh&output=embed",
    googleMapsDirectionsUrl: "https://maps.google.com/?q=Uposhohor,+Rajshahi,+Bangladesh",

    // Hours — TODO: Confirm with owner
    hours: {
        weekdays: "8:00 AM – 10:00 PM", // TODO
        weekdaysBn: "সকাল ৮টা – রাত ১০টা", // TODO
        weekends: "7:00 AM – 11:00 PM", // TODO
        weekendsBn: "সকাল ৭টা – রাত ১১টা", // TODO
        closedDay: null, // e.g. "Friday" or null if open every day — TODO
    },

    /**
     * WAIT TIME — edit this single value to update the banner site-wide.
     * Format: plain English/Bangla string shown directly to customers.
     */
    waitTime: {
        en: "Weekend evenings: expect 30–45 min wait. Weekday mornings: 10–15 min.",
        bn: "সাপ্তাহিক ছুটির সন্ধ্যায়: ৩০–৪৫ মিনিট অপেক্ষা। সপ্তাহের দিনে সকালে: ১০–১৫ মিনিট।",
    },

    // Social / SEO
    siteUrl: "https://kalaighor.com", // TODO: confirm domain
    ogImage: "/og-image.jpg", // TODO: add real OG image at public/og-image.jpg

    // JSON-LD
    priceRange: "৳৳", // budget — two taka signs
    cuisine: ["Bangladeshi", "Bengali", "Kalai Ruti"],
};

/**
 * Menu data — owner-editable.
 * Add/remove items here. prices are in BDT (৳).
 * Set price to null to show "TODO" on the site.
 */
export type MenuItem = {
    id: string;
    nameBn: string;
    nameEn: string;
    descriptionBn?: string;
    descriptionEn?: string;
    price: number | null; // null = TODO placeholder
    category: "ruti" | "bhorta" | "curry" | "combo" | "drink";
    image?: string; // path under /public/images/menu/
    featured?: boolean;
};

export const menuItems: MenuItem[] = [
    // --- Ruti ---
    {
        id: "kalai-ruti-plain",
        nameBn: "সাধারণ কালাই রুটি",
        nameEn: "Plain Kalai Ruti",
        descriptionBn: "মাশকালাই ও আতপ চালের আটায় তৈরি ঐতিহ্যবাহী রুটি",
        descriptionEn: "Traditional flatbread made from black-gram & atap rice flour",
        price: null, // TODO: owner to confirm (~20–30৳)
        category: "ruti",
        featured: true,
    },
    {
        id: "kalai-ruti-special",
        nameBn: "স্পেশাল কালাই রুটি",
        nameEn: "Special Kalai Ruti",
        descriptionBn: "বিশেষ রেসিপিতে তৈরি কালাই রুটি",
        descriptionEn: "Kalai ruti made with our special recipe",
        price: null, // TODO: owner to confirm (~50৳)
        category: "ruti",
        featured: true,
    },

    // --- Bhorta ---
    {
        id: "begun-bhorta",
        nameBn: "বেগুন ভর্তা",
        nameEn: "Begun Bhorta",
        descriptionBn: "আগুনে পোড়া বেগুনের ভর্তা, সরিষার তেল ও ধনেপাতা সহ",
        descriptionEn: "Roasted eggplant mash with mustard oil & coriander",
        price: null, // TODO: owner to confirm (~10৳)
        category: "bhorta",
        featured: true,
    },
    {
        id: "mরিচ-bhorta",
        nameBn: "কাঁচা মরিচ ভর্তা",
        nameEn: "Green Chili Bhorta",
        descriptionBn: "তাজা কাঁচা মরিচের ভর্তা",
        descriptionEn: "Fresh green chili mash",
        price: null, // TODO
        category: "bhorta",
    },
    {
        id: "onion-bhorta",
        nameBn: "পেঁয়াজ ভর্তা",
        nameEn: "Onion Bhorta",
        descriptionBn: "পেঁয়াজ ভর্তা সরিষার তেলে",
        descriptionEn: "Onion mash in mustard oil",
        price: null, // TODO
        category: "bhorta",
    },

    // --- Curry ---
    {
        id: "hasher-mangsho",
        nameBn: "হাঁসের মাংস",
        nameEn: "Duck Curry (Hasher Mangsho)",
        descriptionBn: "দেশি হাঁসের মাংসের ঝোল — কালাই রুটির সেরা সঙ্গী",
        descriptionEn: "Country duck curry — the iconic companion to kalai ruti",
        price: null, // TODO: owner to confirm (~100৳)
        category: "curry",
        featured: true,
    },
    {
        id: "beef-bhuna",
        nameBn: "গরুর ভুনা",
        nameEn: "Beef Bhuna",
        descriptionBn: "মশলাদার গরুর মাংসের ভুনা",
        descriptionEn: "Spiced dry-cooked beef",
        price: null, // TODO: owner to confirm (~120৳)
        category: "curry",
        featured: true,
    },
    {
        id: "bot",
        nameBn: "বট",
        nameEn: "Bot (Offal Curry)",
        descriptionBn: "ঐতিহ্যবাহী বট রান্না",
        descriptionEn: "Traditional offal curry",
        price: null, // TODO: owner to confirm (~80৳)
        category: "curry",
    },

    // --- Combo ---
    {
        id: "combo-basic",
        nameBn: "বেসিক কম্বো",
        nameEn: "Basic Combo",
        descriptionBn: "২টি রুটি + বেগুন ভর্তা + মরিচ ভর্তা",
        descriptionEn: "2 ruti + begun bhorta + chili bhorta",
        price: null, // TODO
        category: "combo",
    },
    {
        id: "combo-full",
        nameBn: "ফুল কম্বো",
        nameEn: "Full Combo",
        descriptionBn: "৩টি রুটি + ২ বর্তা + হাঁসের মাংস বা গরুর ভুনা",
        descriptionEn: "3 ruti + 2 bhorta + duck or beef curry",
        price: null, // TODO
        category: "combo",
        featured: true,
    },
];
