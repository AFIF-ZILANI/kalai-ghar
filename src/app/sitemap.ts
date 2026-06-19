import type { MetadataRoute } from "next";
import { siteConfig } from "@content/site-config";

const PAGES: { path: string; priority: number; changeFreq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "",          priority: 1.0, changeFreq: "weekly"  },
    { path: "/menu",     priority: 0.9, changeFreq: "weekly"  },
    { path: "/visit",    priority: 0.9, changeFreq: "monthly" },
    { path: "/gallery",  priority: 0.8, changeFreq: "weekly"  },
    { path: "/story",    priority: 0.7, changeFreq: "yearly"  },
    { path: "/reserve",  priority: 0.5, changeFreq: "monthly" },
];

const LOCALES = ["bn", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
    const entries: MetadataRoute.Sitemap = [];
    const now = new Date();

    for (const locale of LOCALES) {
        for (const { path, priority, changeFreq } of PAGES) {
            entries.push({
                url: `${siteConfig.siteUrl}/${locale}${path}`,
                lastModified: now,
                changeFrequency: changeFreq,
                priority,
            });
        }
    }

    return entries;
}
