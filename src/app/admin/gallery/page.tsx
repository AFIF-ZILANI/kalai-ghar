"use client";

import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
    Trash2Icon, PencilIcon, CheckIcon, XIcon, PlusIcon, UploadIcon,
    ChevronUpIcon, ChevronDownIcon, GripVerticalIcon,
} from "lucide-react";

type GalleryItem = {
    id: string;
    src: string;
    altBn: string;
    altEn: string;
    captionBn: string;
    captionEn: string;
    aspect: "landscape" | "square" | "portrait";
    category?: "food" | "kitchen" | "ambience" | "people";
    order: number;
};

const ASPECT_DIMS = {
    landscape: { w: 800, h: 534 },
    square: { w: 800, h: 800 },
    portrait: { w: 640, h: 853 },
};

const BLANK_FORM = {
    altBn: "",
    altEn: "",
    captionBn: "",
    captionEn: "",
    aspect: "landscape" as GalleryItem["aspect"],
    category: "food" as NonNullable<GalleryItem["category"]>,
    src: "",
};

export default function GalleryAdminPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editDraft, setEditDraft] = useState<Partial<GalleryItem>>({});
    const [showAdd, setShowAdd] = useState(false);
    const [addForm, setAddForm] = useState(BLANK_FORM);
    const [addFile, setAddFile] = useState<File | null>(null);
    const [addPreview, setAddPreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [reordering, setReordering] = useState(false);
    const [toast, setToast] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch("/api/admin/gallery")
            .then((r) => r.json())
            .then((data) => {
                setItems(data);
                setLoading(false);
            });
    }, []);

    function showToast(msg: string) {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this image? This cannot be undone.")) return;
        await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
        setItems((prev) => prev.filter((i) => i.id !== id));
        showToast("Image deleted.");
    }

    function startEdit(item: GalleryItem) {
        setEditingId(item.id);
        setEditDraft({
            altBn: item.altBn,
            altEn: item.altEn,
            captionBn: item.captionBn,
            captionEn: item.captionEn,
            aspect: item.aspect,
            category: item.category,
        });
    }

    async function saveEdit(id: string) {
        setSaving(true);
        const res = await fetch(`/api/admin/gallery/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editDraft),
        });
        const updated = await res.json();
        setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
        setEditingId(null);
        setSaving(false);
        showToast("Saved.");
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setAddFile(file);
        setAddPreview(file ? URL.createObjectURL(file) : null);
    }

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        const fd = new FormData();
        if (addFile) fd.append("file", addFile);
        else fd.append("src", addForm.src);
        fd.append("altBn", addForm.altBn);
        fd.append("altEn", addForm.altEn);
        fd.append("captionBn", addForm.captionBn);
        fd.append("captionEn", addForm.captionEn);
        fd.append("aspect", addForm.aspect);
        fd.append("category", addForm.category);
        const res = await fetch("/api/admin/gallery", { method: "POST", body: fd });
        const newItem = await res.json();
        setItems((prev) => [...prev, newItem]);
        setAddForm(BLANK_FORM);
        setAddFile(null);
        setAddPreview(null);
        setShowAdd(false);
        setSaving(false);
        showToast("Image added.");
    }

    async function moveItem(idx: number, dir: -1 | 1) {
        const newItems = [...items];
        const target = idx + dir;
        if (target < 0 || target >= newItems.length) return;
        [newItems[idx], newItems[target]] = [newItems[target], newItems[idx]];
        setItems(newItems);
        setReordering(true);
        await fetch("/api/admin/gallery/reorder", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: newItems.map((i) => i.id) }),
        });
        setReordering(false);
        showToast("Order saved.");
    }

    return (
        <AdminShell>
            <div className="p-6 sm:p-8 max-w-5xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-semibold text-neutral-800">Gallery</h1>
                        <p className="text-sm text-neutral-500 mt-0.5">
                            {items.length} image{items.length !== 1 ? "s" : ""}
                            {reordering && <span className="ml-2 text-amber-500">Saving order…</span>}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAdd(true)}
                        className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                        <PlusIcon size={15} />
                        Add image
                    </button>
                </div>

                {/* Add form modal */}
                {showAdd && (
                    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                            <h2 className="text-base font-semibold text-neutral-800 mb-4">Add Image</h2>
                            <form onSubmit={handleAdd} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                                        Upload image
                                    </label>
                                    <div
                                        onClick={() => fileRef.current?.click()}
                                        className="border-2 border-dashed border-neutral-300 rounded-lg p-4 text-center cursor-pointer hover:border-neutral-400 transition-colors"
                                    >
                                        {addPreview ? (
                                            <img src={addPreview} alt="preview" className="mx-auto max-h-40 object-contain rounded" />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 py-4 text-neutral-400">
                                                <UploadIcon size={24} />
                                                <span className="text-xs">Click to select file</span>
                                            </div>
                                        )}
                                    </div>
                                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                </div>

                                {!addFile && (
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                                            Or paste image URL
                                        </label>
                                        <input
                                            type="url"
                                            value={addForm.src}
                                            onChange={(e) => setAddForm((f) => ({ ...f, src: e.target.value }))}
                                            placeholder="https://..."
                                            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: "Caption (Bangla)", key: "captionBn" as const },
                                        { label: "Caption (English)", key: "captionEn" as const },
                                        { label: "Alt text (Bangla)", key: "altBn" as const },
                                        { label: "Alt text (English)", key: "altEn" as const },
                                    ].map(({ label, key }) => (
                                        <div key={key}>
                                            <label className="block text-xs font-medium text-neutral-600 mb-1">{label}</label>
                                            <input
                                                type="text"
                                                value={addForm[key]}
                                                onChange={(e) => setAddForm((f) => ({ ...f, [key]: e.target.value }))}
                                                className="w-full px-2.5 py-1.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-600 mb-1">Aspect ratio</label>
                                        <select
                                            value={addForm.aspect}
                                            onChange={(e) => setAddForm((f) => ({ ...f, aspect: e.target.value as GalleryItem["aspect"] }))}
                                            className="w-full px-2.5 py-1.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                                        >
                                            <option value="landscape">Landscape (3:2)</option>
                                            <option value="square">Square (1:1)</option>
                                            <option value="portrait">Portrait (3:4)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-600 mb-1">Category</label>
                                        <select
                                            value={addForm.category}
                                            onChange={(e) => setAddForm((f) => ({ ...f, category: e.target.value as NonNullable<GalleryItem["category"]> }))}
                                            className="w-full px-2.5 py-1.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                                        >
                                            <option value="food">Food</option>
                                            <option value="kitchen">Kitchen</option>
                                            <option value="ambience">Ambience</option>
                                            <option value="people">People / Guests</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-1">
                                    <button
                                        type="submit"
                                        disabled={saving || (!addFile && !addForm.src)}
                                        className="flex-1 bg-neutral-900 hover:bg-neutral-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                                    >
                                        {saving ? "Adding…" : "Add image"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setShowAdd(false); setAddForm(BLANK_FORM); setAddFile(null); setAddPreview(null); }}
                                        className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Reorder hint */}
                {items.length > 1 && (
                    <p className="flex items-center gap-1.5 text-xs text-neutral-400 mb-4">
                        <GripVerticalIcon size={13} />
                        Use the arrows to reorder images. Order is reflected on the public gallery.
                    </p>
                )}

                {/* Gallery grid */}
                {loading ? (
                    <div className="text-sm text-neutral-500">Loading…</div>
                ) : items.length === 0 ? (
                    <div className="text-sm text-neutral-500">No images yet. Add one above.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((item, idx) => {
                            const dims = ASPECT_DIMS[item.aspect];
                            const isEditing = editingId === item.id;
                            return (
                                <div key={item.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                                    {/* Order controls */}
                                    <div className="flex items-center gap-1 px-3 pt-2 pb-0">
                                        <span className="text-[10px] font-mono text-neutral-300 mr-1">#{idx + 1}</span>
                                        <button
                                            onClick={() => moveItem(idx, -1)}
                                            disabled={idx === 0}
                                            title="Move up"
                                            className="p-0.5 text-neutral-300 hover:text-neutral-600 disabled:opacity-20 transition-colors"
                                        >
                                            <ChevronUpIcon size={14} />
                                        </button>
                                        <button
                                            onClick={() => moveItem(idx, 1)}
                                            disabled={idx === items.length - 1}
                                            title="Move down"
                                            className="p-0.5 text-neutral-300 hover:text-neutral-600 disabled:opacity-20 transition-colors"
                                        >
                                            <ChevronDownIcon size={14} />
                                        </button>
                                        {item.category && (
                                            <span className="ml-auto text-[10px] text-neutral-300 bg-neutral-100 px-1.5 py-0.5 rounded capitalize">
                                                {item.category}
                                            </span>
                                        )}
                                    </div>

                                    <div className="relative bg-neutral-100 mx-3 mt-1 rounded overflow-hidden">
                                        <Image
                                            src={item.src}
                                            alt={item.altEn || "gallery image"}
                                            width={dims.w}
                                            height={dims.h}
                                            className="w-full h-auto object-cover"
                                            unoptimized={item.src.startsWith("http")}
                                        />
                                    </div>

                                    <div className="p-3">
                                        {isEditing ? (
                                            <div className="space-y-2">
                                                {[
                                                    { ph: "Caption (Bangla)", key: "captionBn" as const },
                                                    { ph: "Caption (English)", key: "captionEn" as const },
                                                    { ph: "Alt (Bangla)", key: "altBn" as const },
                                                    { ph: "Alt (English)", key: "altEn" as const },
                                                ].map(({ ph, key }) => (
                                                    <input
                                                        key={key}
                                                        type="text"
                                                        placeholder={ph}
                                                        value={(editDraft[key] as string) ?? ""}
                                                        onChange={(e) => setEditDraft((d) => ({ ...d, [key]: e.target.value }))}
                                                        className="w-full px-2 py-1 text-xs border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-neutral-900"
                                                    />
                                                ))}
                                                <div className="grid grid-cols-2 gap-2">
                                                    <select
                                                        value={editDraft.aspect ?? "landscape"}
                                                        onChange={(e) => setEditDraft((d) => ({ ...d, aspect: e.target.value as GalleryItem["aspect"] }))}
                                                        className="w-full px-2 py-1 text-xs border border-neutral-300 rounded focus:outline-none"
                                                    >
                                                        <option value="landscape">Landscape</option>
                                                        <option value="square">Square</option>
                                                        <option value="portrait">Portrait</option>
                                                    </select>
                                                    <select
                                                        value={editDraft.category ?? "food"}
                                                        onChange={(e) => setEditDraft((d) => ({ ...d, category: e.target.value as GalleryItem["category"] }))}
                                                        className="w-full px-2 py-1 text-xs border border-neutral-300 rounded focus:outline-none"
                                                    >
                                                        <option value="food">Food</option>
                                                        <option value="kitchen">Kitchen</option>
                                                        <option value="ambience">Ambience</option>
                                                        <option value="people">People</option>
                                                    </select>
                                                </div>
                                                <div className="flex gap-1.5 pt-1">
                                                    <button
                                                        onClick={() => saveEdit(item.id)}
                                                        disabled={saving}
                                                        className="flex items-center gap-1 px-2.5 py-1 bg-neutral-900 text-white text-xs rounded hover:bg-neutral-700 disabled:opacity-50 transition-colors"
                                                    >
                                                        <CheckIcon size={11} /> Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="flex items-center gap-1 px-2.5 py-1 text-neutral-600 text-xs border border-neutral-200 rounded hover:bg-neutral-50 transition-colors"
                                                    >
                                                        <XIcon size={11} /> Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-xs text-neutral-500 truncate">
                                                    {item.captionEn || <span className="italic text-neutral-300">No caption</span>}
                                                </p>
                                                <p className="text-[11px] text-neutral-400 truncate">{item.captionBn}</p>
                                                <div className="flex items-center gap-1.5 mt-2">
                                                    <span className="text-[10px] text-neutral-300 bg-neutral-100 px-1.5 py-0.5 rounded">
                                                        {item.aspect}
                                                    </span>
                                                    <div className="flex-1" />
                                                    <button
                                                        onClick={() => startEdit(item)}
                                                        className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <PencilIcon size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2Icon size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
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
