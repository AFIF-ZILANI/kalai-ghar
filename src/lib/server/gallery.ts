import fs from "fs";
import path from "path";

export type GalleryItem = {
    id: string;
    src: string;
    altBn: string;
    altEn: string;
    captionBn: string;
    captionEn: string;
    aspect: "landscape" | "square" | "portrait";
    order: number;
};

const DATA_PATH = path.join(process.cwd(), "data", "gallery.json");

export function readGallery(): GalleryItem[] {
    try {
        const raw = fs.readFileSync(DATA_PATH, "utf-8");
        const items: GalleryItem[] = JSON.parse(raw);
        return items.sort((a, b) => a.order - b.order);
    } catch {
        return [];
    }
}

export function writeGallery(items: GalleryItem[]): void {
    fs.writeFileSync(DATA_PATH, JSON.stringify(items, null, 2));
}
