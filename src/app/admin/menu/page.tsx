"use client";

import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";
import { Trash2Icon, PencilIcon, CheckIcon, XIcon, PlusIcon } from "lucide-react";

type MenuCategory = "ruti" | "rice" | "curry" | "bhorta" | "side";

type MenuItem = {
    id: string;
    nameBn: string;
    nameEn: string;
    price: number;
    category: MenuCategory;
    featured?: boolean;
    order: number;
};

const CATEGORIES: { value: MenuCategory; label: string }[] = [
    { value: "ruti", label: "Ruti & Bread" },
    { value: "rice", label: "Rice & Khichuri" },
    { value: "curry", label: "Meat & Curry" },
    { value: "bhorta", label: "Bhorta & Vegetables" },
    { value: "side", label: "Fish, Eggs & More" },
];

const BLANK: Omit<MenuItem, "id" | "order"> = {
    nameBn: "", nameEn: "", price: 0, category: "ruti", featured: false,
};

const inp = "border border-neutral-200 rounded px-3 py-2 text-sm w-full focus:outline-none focus:border-neutral-400";
const btn = (variant: "primary" | "ghost" | "danger") =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
        variant === "primary" ? "bg-neutral-900 text-white hover:bg-neutral-700" :
        variant === "danger"  ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" :
                                "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
    }`;

export default function MenuAdminPage() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [draft, setDraft] = useState<Partial<MenuItem>>({});
    const [showAdd, setShowAdd] = useState(false);
    const [addForm, setAddForm] = useState(BLANK);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState("");

    function showToast(msg: string) {
        setToast(msg);
        setTimeout(() => setToast(""), 2500);
    }

    useEffect(() => {
        fetch("/api/admin/menu")
            .then((r) => r.json())
            .then((data) => { setItems(data); setLoading(false); });
    }, []);

    async function saveEdit(id: string) {
        setSaving(true);
        const res = await fetch(`/api/admin/menu/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(draft),
        });
        if (res.ok) {
            const updated = await res.json();
            setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
            setEditingId(null);
            showToast("Saved");
        }
        setSaving(false);
    }

    async function deleteItem(id: string) {
        if (!confirm("Delete this item?")) return;
        await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
        setItems((prev) => prev.filter((i) => i.id !== id));
        showToast("Deleted");
    }

    async function addItem() {
        if (!addForm.nameBn || !addForm.nameEn) return;
        setSaving(true);
        const res = await fetch("/api/admin/menu", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(addForm),
        });
        if (res.ok) {
            const created = await res.json();
            setItems((prev) => [...prev, created]);
            setAddForm(BLANK);
            setShowAdd(false);
            showToast("Item added");
        }
        setSaving(false);
    }

    const grouped = CATEGORIES.map((cat) => ({
        ...cat,
        items: items.filter((i) => i.category === cat.value),
    }));

    return (
        <AdminShell>
            <div className="p-8 max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-xl font-semibold text-neutral-900">Menu</h1>
                        <p className="text-sm text-neutral-500 mt-0.5">{items.length} items across {CATEGORIES.length} categories</p>
                    </div>
                    <button onClick={() => { setShowAdd(true); setEditingId(null); }} className={btn("primary")}>
                        <PlusIcon size={14} /> Add item
                    </button>
                </div>

                {/* Add form */}
                {showAdd && (
                    <div className="mb-8 bg-white border border-neutral-200 rounded-xl p-5">
                        <p className="text-sm font-semibold text-neutral-700 mb-4">New item</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-neutral-500 mb-1 block">Bengali name *</label>
                                <input className={inp} value={addForm.nameBn} onChange={(e) => setAddForm((f) => ({ ...f, nameBn: e.target.value }))} placeholder="কালাই রুটি" />
                            </div>
                            <div>
                                <label className="text-xs text-neutral-500 mb-1 block">English name *</label>
                                <input className={inp} value={addForm.nameEn} onChange={(e) => setAddForm((f) => ({ ...f, nameEn: e.target.value }))} placeholder="Kalai Ruti" />
                            </div>
                            <div>
                                <label className="text-xs text-neutral-500 mb-1 block">Price (৳)</label>
                                <input type="number" className={inp} value={addForm.price} onChange={(e) => setAddForm((f) => ({ ...f, price: Number(e.target.value) }))} />
                            </div>
                            <div>
                                <label className="text-xs text-neutral-500 mb-1 block">Category</label>
                                <select className={inp} value={addForm.category} onChange={(e) => setAddForm((f) => ({ ...f, category: e.target.value as MenuCategory }))}>
                                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                                <input type="checkbox" id="add-featured" checked={!!addForm.featured} onChange={(e) => setAddForm((f) => ({ ...f, featured: e.target.checked }))} />
                                <label htmlFor="add-featured" className="text-sm text-neutral-600">Show as featured on homepage</label>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button onClick={addItem} disabled={saving || !addForm.nameBn || !addForm.nameEn} className={btn("primary")}>
                                <CheckIcon size={13} /> {saving ? "Saving…" : "Add item"}
                            </button>
                            <button onClick={() => setShowAdd(false)} className={btn("ghost")}>
                                <XIcon size={13} /> Cancel
                            </button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <p className="text-sm text-neutral-400">Loading…</p>
                ) : (
                    <div className="space-y-8">
                        {grouped.map(({ value, label, items: catItems }) => (
                            <section key={value}>
                                <div className="flex items-center gap-3 mb-3">
                                    <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">{label}</h2>
                                    <span className="text-xs text-neutral-300">{catItems.length} items</span>
                                </div>
                                <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100">
                                    {catItems.length === 0 && (
                                        <p className="px-4 py-3 text-xs text-neutral-400 italic">No items</p>
                                    )}
                                    {catItems.map((item) => (
                                        <div key={item.id} className="px-4 py-3">
                                            {editingId === item.id ? (
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-xs text-neutral-500 mb-1 block">Bengali name</label>
                                                        <input className={inp} value={draft.nameBn ?? item.nameBn} onChange={(e) => setDraft((d) => ({ ...d, nameBn: e.target.value }))} />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-neutral-500 mb-1 block">English name</label>
                                                        <input className={inp} value={draft.nameEn ?? item.nameEn} onChange={(e) => setDraft((d) => ({ ...d, nameEn: e.target.value }))} />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-neutral-500 mb-1 block">Price (৳)</label>
                                                        <input type="number" className={inp} value={draft.price ?? item.price} onChange={(e) => setDraft((d) => ({ ...d, price: Number(e.target.value) }))} />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-neutral-500 mb-1 block">Category</label>
                                                        <select className={inp} value={draft.category ?? item.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value as MenuCategory }))}>
                                                            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="col-span-2 flex items-center gap-2">
                                                        <input type="checkbox" id={`feat-${item.id}`}
                                                            checked={draft.featured !== undefined ? draft.featured : !!item.featured}
                                                            onChange={(e) => setDraft((d) => ({ ...d, featured: e.target.checked }))} />
                                                        <label htmlFor={`feat-${item.id}`} className="text-sm text-neutral-600">Featured on homepage</label>
                                                    </div>
                                                    <div className="col-span-2 flex gap-2">
                                                        <button onClick={() => saveEdit(item.id)} disabled={saving} className={btn("primary")}>
                                                            <CheckIcon size={13} /> {saving ? "…" : "Save"}
                                                        </button>
                                                        <button onClick={() => setEditingId(null)} className={btn("ghost")}>
                                                            <XIcon size={13} /> Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-neutral-900">{item.nameBn}</p>
                                                        <p className="text-xs text-neutral-500">{item.nameEn}</p>
                                                    </div>
                                                    <span className="text-sm font-semibold text-neutral-700 shrink-0">৳{item.price}</span>
                                                    {item.featured && (
                                                        <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded shrink-0">
                                                            Featured
                                                        </span>
                                                    )}
                                                    <div className="flex gap-1.5 shrink-0">
                                                        <button onClick={() => { setEditingId(item.id); setDraft({}); }} className={btn("ghost")}>
                                                            <PencilIcon size={12} />
                                                        </button>
                                                        <button onClick={() => deleteItem(item.id)} className={btn("danger")}>
                                                            <Trash2Icon size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>

            {toast && (
                <div className="fixed bottom-6 right-6 bg-neutral-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg">
                    {toast}
                </div>
            )}
        </AdminShell>
    );
}
