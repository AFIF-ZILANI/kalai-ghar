import fs from "fs";
import path from "path";

export type MenuCategory = "ruti" | "rice" | "curry" | "bhorta" | "side";

export type MenuItem = {
    id: string;
    nameBn: string;
    nameEn: string;
    price: number;
    category: MenuCategory;
    featured?: boolean;
    order: number;
};

const DATA_PATH = path.join(process.cwd(), "data", "menu.json");

export function readMenu(): MenuItem[] {
    try {
        const raw = fs.readFileSync(DATA_PATH, "utf-8");
        const items: MenuItem[] = JSON.parse(raw);
        return items.sort((a, b) => a.order - b.order);
    } catch {
        return [];
    }
}

export function writeMenu(items: MenuItem[]): void {
    fs.writeFileSync(DATA_PATH, JSON.stringify(items, null, 2));
}
