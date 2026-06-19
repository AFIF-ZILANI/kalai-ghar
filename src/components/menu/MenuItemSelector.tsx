"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MinusIcon, PlusIcon, ShoppingBagIcon } from "lucide-react";

type MenuItem = {
    id: string;
    nameBn: string;
    nameEn: string;
    price: number;
    category: string;
    featured?: boolean;
};

type Props = {
    items: MenuItem[];
    locale: string;
    categoryLabels: Record<string, string>;
    categoryOrder: string[];
};

export default function MenuItemSelector({ items, locale, categoryLabels, categoryOrder }: Props) {
    const router = useRouter();
    const isBn = locale === "bn";
    const [cart, setCart] = useState<Record<string, number>>({});

    const totalQty = Object.values(cart).reduce((s, q) => s + q, 0);
    const totalPrice = useMemo(
        () => items.reduce((s, item) => s + (cart[item.id] ?? 0) * item.price, 0),
        [cart, items],
    );

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

    function goPreOrder() {
        const itemsParam = Object.entries(cart)
            .filter(([, q]) => q > 0)
            .map(([id, q]) => `${id}:${q}`)
            .join(",");
        router.push(`/${locale}/reserve?items=${encodeURIComponent(itemsParam)}`);
    }

    const grouped = categoryOrder
        .map((cat) => ({ cat, label: categoryLabels[cat] ?? cat, items: items.filter((i) => i.category === cat) }))
        .filter((g) => g.items.length > 0);

    return (
        <div className="pb-32">
            <div className="space-y-12 sm:space-y-16">
                {grouped.map(({ cat, label, items: catItems }, catIdx) => (
                    <section key={cat} aria-labelledby={`cat-${cat}`}>
                        <div className="flex items-baseline gap-4 mb-6 border-b border-[var(--color-earth-100)] pb-3">
                            <h2
                                id={`cat-${cat}`}
                                className="font-display text-xl sm:text-2xl font-semibold text-[var(--color-ink)]"
                            >
                                {label}
                            </h2>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-ink)]/30">
                                {String(catIdx + 1).padStart(2, "0")}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-earth-100)]">
                            {catItems.map((item) => {
                                const qty = cart[item.id] ?? 0;
                                return (
                                    <div
                                        key={item.id}
                                        className={`bg-[var(--color-cream)] p-5 sm:p-6 flex flex-col gap-3 transition-colors ${
                                            qty > 0 ? "ring-1 ring-inset ring-[var(--color-terracotta-400)]" : ""
                                        }`}
                                    >
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-[var(--color-ink)] text-base leading-snug">
                                                    {isBn ? item.nameBn : item.nameEn}
                                                </h3>
                                                <p className="text-[11px] text-[var(--color-ink)]/35 tracking-wide mt-0.5">
                                                    {isBn ? item.nameEn : item.nameBn}
                                                </p>
                                            </div>
                                            <span className="shrink-0 font-display font-semibold text-[var(--color-terracotta-600)] text-base">
                                                ৳{item.price}
                                            </span>
                                        </div>

                                        {/* Qty control */}
                                        <div className="flex items-center gap-2 mt-auto">
                                            {qty === 0 ? (
                                                <button
                                                    onClick={() => setQty(item.id, 1)}
                                                    className="flex-1 flex items-center justify-center gap-1.5 border border-[var(--color-earth-200)] text-[var(--color-ink)]/60 hover:border-[var(--color-terracotta-400)] hover:text-[var(--color-terracotta-600)] text-[11px] font-semibold uppercase tracking-widest py-2.5 transition-colors"
                                                >
                                                    <PlusIcon size={12} strokeWidth={2.5} />
                                                    {isBn ? "যোগ করুন" : "Add"}
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2 flex-1">
                                                    <button
                                                        onClick={() => setQty(item.id, -1)}
                                                        className="w-9 h-9 flex items-center justify-center border border-[var(--color-earth-200)] text-[var(--color-ink)]/60 hover:border-[var(--color-terracotta-400)] hover:text-[var(--color-terracotta-600)] transition-colors"
                                                        aria-label="Remove one"
                                                    >
                                                        <MinusIcon size={13} strokeWidth={2.5} />
                                                    </button>
                                                    <span className="flex-1 text-center font-display font-semibold text-[var(--color-ink)] text-lg leading-none">
                                                        {qty}
                                                    </span>
                                                    <button
                                                        onClick={() => setQty(item.id, 1)}
                                                        className="w-9 h-9 flex items-center justify-center border border-[var(--color-earth-200)] text-[var(--color-ink)]/60 hover:border-[var(--color-terracotta-400)] hover:text-[var(--color-terracotta-600)] transition-colors"
                                                        aria-label="Add one"
                                                    >
                                                        <PlusIcon size={13} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>

            {/* Sticky pre-order bar */}
            {totalQty > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-ink)] text-white safe-area-inset-bottom">
                    <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-4 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-semibold">
                                {totalQty} {isBn ? "আইটেম" : totalQty === 1 ? "item" : "items"}
                                {" · "}
                                <span className="text-[var(--color-saffron-400)]">৳{totalPrice}</span>
                            </p>
                            <p className="text-[11px] text-white/40 mt-0.5">
                                {isBn ? "হোয়াটসঅ্যাপে নিশ্চিত হবে" : "Confirmed via WhatsApp"}
                            </p>
                        </div>
                        <button
                            onClick={goPreOrder}
                            className="flex items-center gap-2 bg-[var(--color-terracotta-500)] hover:bg-[var(--color-terracotta-400)] text-white font-semibold px-6 py-3 transition-colors text-sm tracking-wide shrink-0"
                        >
                            <ShoppingBagIcon size={16} strokeWidth={2} />
                            {isBn ? "অর্ডার করুন" : "Pre-Order"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
