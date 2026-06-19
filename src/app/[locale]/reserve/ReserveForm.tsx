"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { MessageCircle, MinusIcon, PlusIcon, XIcon, PlusCircleIcon } from "lucide-react";
import { toWaNumber } from "@/lib/whatsapp";
import DateTimePicker from "@/components/ui/DateTimePicker";

type MenuItem = {
    id: string;
    nameBn: string;
    nameEn: string;
    price: number;
    category: string;
};

type CartItem = MenuItem & { qty: number };

type Props = {
    locale: string;
    whatsapp: string;
    menuItems: MenuItem[];
};

const CATEGORY_ORDER = ["ruti", "rice", "curry", "bhorta", "side"];

const CATEGORY_LABELS: Record<string, { en: string; bn: string }> = {
    ruti:   { en: "Ruti & Bread",         bn: "রুটি" },
    rice:   { en: "Rice & Khichuri",       bn: "ভাত ও খিচুরী" },
    curry:  { en: "Meat & Curry",          bn: "মাংস ও তরকারি" },
    bhorta: { en: "Bhorta & Vegetables",   bn: "ভর্তা ও সবজি" },
    side:   { en: "Fish, Eggs & More",     bn: "মাছ, ডিম ও আরও" },
};

export default function ReserveForm({ locale, whatsapp, menuItems }: Props) {
    const t = useTranslations("reserve");
    const searchParams = useSearchParams();
    const isBn = locale === "bn";

    const [name, setName] = useState("");
    const [partySize, setPartySize] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [notes, setNotes] = useState("");
    const [cart, setCart] = useState<Record<string, number>>({});
    const [showPicker, setShowPicker] = useState(false);
    const [pickerCat, setPickerCat] = useState(CATEGORY_ORDER[0]);

    // Initialise cart from ?items=id1:qty1,id2:qty2
    useEffect(() => {
        const raw = searchParams.get("items");
        if (!raw) return;
        const initial: Record<string, number> = {};
        raw.split(",").forEach((pair) => {
            const [id, qty] = pair.split(":");
            if (id && qty && Number(qty) > 0) initial[id] = Number(qty);
        });
        setCart(initial);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function setQty(id: string, delta: number) {
        setCart((prev) => {
            const next = (prev[id] ?? 0) + delta;
            if (next <= 0) {
                const { [id]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [id]: next };
        });
    }

    const cartItems: CartItem[] = useMemo(
        () =>
            menuItems
                .filter((m) => (cart[m.id] ?? 0) > 0)
                .map((m) => ({ ...m, qty: cart[m.id] })),
        [cart, menuItems],
    );

    const totalPrice = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const totalQty = cartItems.reduce((s, i) => s + i.qty, 0);

    function formatDateTime(raw: string) {
        // raw is "YYYY-MM-DD HH:MM" or partial
        const [datePart, timePart] = raw.split(" ");
        if (!datePart) return raw;
        const MONTHS_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const MONTHS_BN = ["জানু","ফেব্রু","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টে","অক্টো","নভে","ডিসে"];
        const d = new Date(datePart + "T00:00:00");
        const dateLabel = isBn
            ? `${d.getDate()} ${MONTHS_BN[d.getMonth()]} ${d.getFullYear()}`
            : `${MONTHS_EN[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
        if (!timePart) return dateLabel;
        const [h, min] = timePart.split(":").map(Number);
        const period = h < 12 ? (isBn ? "সকাল" : "AM") : (isBn ? "বিকেল/রাত" : "PM");
        const h12 = h % 12 || 12;
        const timeLabel = `${h12}:${String(min).padStart(2, "0")} ${period}`;
        return `${dateLabel}, ${timeLabel}`;
    }

    function buildMessage() {
        const lines: string[] = [];
        if (isBn) {
            lines.push("🙏 নমস্কার কালাই ঘর! আমি একটি আগাম অর্ডার দিতে চাই।");
            if (name) lines.push(`নাম: ${name}`);
            if (partySize) lines.push(`দলের সংখ্যা: ${partySize} জন`);
            if (dateTime) lines.push(`পছন্দের সময়: ${formatDateTime(dateTime)}`);
            if (cartItems.length) {
                lines.push("অর্ডার:");
                cartItems.forEach((i) => lines.push(`  • ${i.nameBn} × ${i.qty} = ৳${i.price * i.qty}`));
                lines.push(`মোট: ৳${totalPrice}`);
            }
            if (notes) lines.push(`বিশেষ অনুরোধ: ${notes}`);
        } else {
            lines.push("🙏 Hello Kalai Ghor! I'd like to pre-order.");
            if (name) lines.push(`Name: ${name}`);
            if (partySize) lines.push(`Party size: ${partySize}`);
            if (dateTime) lines.push(`Preferred time: ${formatDateTime(dateTime)}`);
            if (cartItems.length) {
                lines.push("Order:");
                cartItems.forEach((i) => lines.push(`  • ${i.nameEn} × ${i.qty} = ৳${i.price * i.qty}`));
                lines.push(`Total: ৳${totalPrice}`);
            }
            if (notes) lines.push(`Special requests: ${notes}`);
        }
        return lines.join("\n");
    }

    const inp = "w-full border border-[var(--color-earth-100)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/30 focus:outline-none focus:border-[var(--color-terracotta-400)] transition";
    const label = "block text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-ink)]/50 mb-2";

    const pickerItems = menuItems.filter((m) => m.category === pickerCat);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const url = `https://wa.me/${toWaNumber(whatsapp)}?text=${encodeURIComponent(buildMessage())}`;
                window.open(url, "_blank", "noopener,noreferrer");
            }}
            className="space-y-5 border border-[var(--color-earth-100)] bg-white p-6 sm:p-8"
        >
            {/* ── Order items ── */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <span className={label} style={{ marginBottom: 0 }}>
                        {isBn ? "অর্ডার আইটেম" : "Order items"}{" "}
                        <span aria-hidden className="text-[var(--color-terracotta-500)]">*</span>
                    </span>
                    {totalQty > 0 && (
                        <span className="text-xs font-semibold text-[var(--color-terracotta-600)]">
                            {totalQty} {isBn ? "টি" : totalQty === 1 ? "item" : "items"} · ৳{totalPrice}
                        </span>
                    )}
                </div>

                {/* Cart */}
                {cartItems.length > 0 ? (
                    <div className="border border-[var(--color-earth-100)] divide-y divide-[var(--color-earth-100)] mb-3">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[var(--color-ink)] leading-tight">
                                        {isBn ? item.nameBn : item.nameEn}
                                    </p>
                                    <p className="text-[11px] text-[var(--color-ink)]/40 mt-0.5">
                                        ৳{item.price} {isBn ? "প্রতিটি" : "each"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setQty(item.id, -1)}
                                        className="w-7 h-7 flex items-center justify-center border border-[var(--color-earth-200)] hover:border-[var(--color-terracotta-400)] text-[var(--color-ink)]/50 hover:text-[var(--color-terracotta-600)] transition-colors"
                                    >
                                        {item.qty === 1 ? <XIcon size={11} strokeWidth={2.5} /> : <MinusIcon size={11} strokeWidth={2.5} />}
                                    </button>
                                    <span className="w-6 text-center text-sm font-semibold text-[var(--color-ink)]">{item.qty}</span>
                                    <button
                                        type="button"
                                        onClick={() => setQty(item.id, 1)}
                                        className="w-7 h-7 flex items-center justify-center border border-[var(--color-earth-200)] hover:border-[var(--color-terracotta-400)] text-[var(--color-ink)]/50 hover:text-[var(--color-terracotta-600)] transition-colors"
                                    >
                                        <PlusIcon size={11} strokeWidth={2.5} />
                                    </button>
                                </div>
                                <span className="text-sm font-semibold text-[var(--color-terracotta-600)] w-14 text-right shrink-0">
                                    ৳{item.price * item.qty}
                                </span>
                            </div>
                        ))}
                        {totalQty > 0 && (
                            <div className="flex justify-between items-center px-4 py-2.5 bg-[var(--color-earth-50)]">
                                <span className="text-xs font-semibold text-[var(--color-ink)]/50 uppercase tracking-widest">
                                    {isBn ? "মোট" : "Total"}
                                </span>
                                <span className="text-sm font-bold text-[var(--color-ink)]">৳{totalPrice}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="border border-dashed border-[var(--color-earth-200)] px-4 py-6 text-center text-sm text-[var(--color-ink)]/35 mb-3">
                        {isBn ? "কোনো আইটেম যোগ করা হয়নি" : "No items added yet"}
                    </div>
                )}

                {/* Add item picker */}
                <button
                    type="button"
                    onClick={() => setShowPicker((v) => !v)}
                    className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--color-terracotta-500)] hover:text-[var(--color-terracotta-700)] transition-colors"
                >
                    <PlusCircleIcon size={13} strokeWidth={2} />
                    {isBn ? "আইটেম যোগ করুন" : "Add item"}
                </button>

                {showPicker && (
                    <div className="mt-3 border border-[var(--color-earth-100)] bg-[var(--color-earth-50)]">
                        {/* Category tabs */}
                        <div className="flex overflow-x-auto border-b border-[var(--color-earth-100)] scrollbar-hide">
                            {CATEGORY_ORDER.map((cat) => {
                                const hasItems = menuItems.some((m) => m.category === cat);
                                if (!hasItems) return null;
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setPickerCat(cat)}
                                        className={`shrink-0 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest transition-colors whitespace-nowrap ${
                                            pickerCat === cat
                                                ? "bg-white text-[var(--color-ink)] border-b-2 border-[var(--color-terracotta-500)] -mb-px"
                                                : "text-[var(--color-ink)]/40 hover:text-[var(--color-ink)]"
                                        }`}
                                    >
                                        {CATEGORY_LABELS[cat]?.[isBn ? "bn" : "en"] ?? cat}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="max-h-60 overflow-y-auto divide-y divide-[var(--color-earth-100)]">
                            {pickerItems.map((item) => {
                                const qty = cart[item.id] ?? 0;
                                return (
                                    <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-[var(--color-cream)] transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-[var(--color-ink)] leading-tight">{isBn ? item.nameBn : item.nameEn}</p>
                                            <p className="text-[11px] text-[var(--color-ink)]/40">৳{item.price}</p>
                                        </div>
                                        {qty === 0 ? (
                                            <button
                                                type="button"
                                                onClick={() => setQty(item.id, 1)}
                                                className="shrink-0 flex items-center gap-1 px-3 py-1.5 border border-[var(--color-earth-200)] hover:border-[var(--color-terracotta-400)] text-[var(--color-ink)]/50 hover:text-[var(--color-terracotta-600)] text-[11px] font-medium transition-colors"
                                            >
                                                <PlusIcon size={10} strokeWidth={2.5} />
                                                {isBn ? "যোগ" : "Add"}
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <button type="button" onClick={() => setQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center border border-[var(--color-earth-200)] text-[var(--color-ink)]/50 hover:text-[var(--color-terracotta-600)] transition-colors">
                                                    <MinusIcon size={10} strokeWidth={2.5} />
                                                </button>
                                                <span className="w-5 text-center text-sm font-semibold text-[var(--color-ink)]">{qty}</span>
                                                <button type="button" onClick={() => setQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center border border-[var(--color-earth-200)] text-[var(--color-ink)]/50 hover:text-[var(--color-terracotta-600)] transition-colors">
                                                    <PlusIcon size={10} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Name ── */}
            <div>
                <label htmlFor="reserve-name" className={label}>
                    {t("nameLabel")} <span aria-hidden className="text-[var(--color-terracotta-500)]">*</span>
                </label>
                <input
                    id="reserve-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("namePlaceholder")}
                    className={inp}
                />
            </div>

            {/* ── Party size ── */}
            <div>
                <label htmlFor="reserve-party" className={label}>{t("partySizeLabel")}</label>
                <input
                    id="reserve-party"
                    type="number"
                    min={1}
                    max={100}
                    value={partySize}
                    onChange={(e) => setPartySize(e.target.value)}
                    placeholder={t("partySizePlaceholder")}
                    className={inp}
                />
            </div>

            {/* ── Date & time ── */}
            <div>
                <span className={label}>{t("dateLabel")}</span>
                <DateTimePicker value={dateTime} onChange={setDateTime} locale={locale} />
            </div>

            {/* ── Notes ── */}
            <div>
                <label htmlFor="reserve-notes" className={label}>{t("notesLabel")}</label>
                <textarea
                    id="reserve-notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("notesPlaceholder")}
                    className={`${inp} resize-y`}
                />
            </div>

            <button
                type="submit"
                disabled={cartItems.length === 0 || !name}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fb856] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-6 py-4 sm:py-3 transition-colors text-sm tracking-wide"
            >
                <MessageCircle size={20} />
                {t("submitBtn")}
            </button>
        </form>
    );
}
