import fs from "fs";
import path from "path";
import { siteConfig } from "@content/site-config";

export type ContactData = {
    phone: string;
    whatsapp: string;
    address: {
        street: string;
        area: string;
        city: string;
        dhakaStreet: string;
    };
    geo: { lat: number; lng: number };
    googleMapsDirectionsUrl: string;
    googleMapsEmbedUrl: string;
    hours: {
        weekdays: string;
        weekdaysBn: string;
        weekends: string;
        weekendsBn: string;
    };
    waitTime: { en: string; bn: string };
};

const DATA_PATH = path.join(process.cwd(), "data", "contact.json");

function readOverrides(): Partial<ContactData> {
    try {
        return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
    } catch {
        return {};
    }
}

export function getContactData(): ContactData {
    const overrides = readOverrides();
    return {
        phone: overrides.phone || siteConfig.phone,
        whatsapp: overrides.whatsapp || siteConfig.whatsapp,
        address: {
            street: overrides.address?.street || siteConfig.address.street,
            area: overrides.address?.area || siteConfig.address.area,
            city: overrides.address?.city || siteConfig.address.city,
            dhakaStreet: overrides.address?.dhakaStreet || siteConfig.address.dhakaStreet,
        },
        geo: {
            lat: overrides.geo?.lat || siteConfig.geo.lat,
            lng: overrides.geo?.lng || siteConfig.geo.lng,
        },
        googleMapsDirectionsUrl:
            overrides.googleMapsDirectionsUrl || siteConfig.googleMapsDirectionsUrl,
        googleMapsEmbedUrl: overrides.googleMapsEmbedUrl || siteConfig.googleMapsEmbedUrl,
        hours: {
            weekdays: overrides.hours?.weekdays || siteConfig.hours.weekdays,
            weekdaysBn: overrides.hours?.weekdaysBn || siteConfig.hours.weekdaysBn,
            weekends: overrides.hours?.weekends || siteConfig.hours.weekends,
            weekendsBn: overrides.hours?.weekendsBn || siteConfig.hours.weekendsBn,
        },
        waitTime: {
            en: overrides.waitTime?.en || siteConfig.waitTime.en,
            bn: overrides.waitTime?.bn || siteConfig.waitTime.bn,
        },
    };
}

export function writeContactData(data: Partial<ContactData>): void {
    const current = readOverrides();
    const merged = deepMerge(current, data);
    fs.writeFileSync(DATA_PATH, JSON.stringify(merged, null, 2));
}

function deepMerge<T extends object>(base: T, override: Partial<T>): T {
    const result = { ...base };
    for (const key in override) {
        const val = override[key];
        if (val && typeof val === "object" && !Array.isArray(val)) {
            (result as Record<string, unknown>)[key] = deepMerge(
                (base as Record<string, unknown>)[key] as object ?? {},
                val as object
            );
        } else if (val !== undefined) {
            (result as Record<string, unknown>)[key] = val;
        }
    }
    return result;
}
