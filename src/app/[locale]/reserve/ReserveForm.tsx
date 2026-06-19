"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { toWaNumber } from "@/lib/whatsapp";

type Props = {
    locale: string;
    whatsapp: string;
};

export default function ReserveForm({ locale, whatsapp }: Props) {
    const t = useTranslations("reserve");

    const [name, setName] = useState("");
    const [partySize, setPartySize] = useState("");
    const [date, setDate] = useState("");
    const [items, setItems] = useState("");
    const [notes, setNotes] = useState("");

    function buildWhatsAppURL() {
        const lines: string[] = [];
        if (locale === "bn") {
            lines.push("🙏 নমস্কার কালাই ঘর! আমি একটি আগাম অর্ডার দিতে চাই।");
            if (name) lines.push(`নাম: ${name}`);
            if (partySize) lines.push(`দলের সংখ্যা: ${partySize} জন`);
            if (date) lines.push(`পছন্দের সময়: ${date}`);
            if (items) lines.push(`অর্ডার: ${items}`);
            if (notes) lines.push(`বিশেষ অনুরোধ: ${notes}`);
        } else {
            lines.push("🙏 Hello Kalai Ghor! I'd like to pre-order.");
            if (name) lines.push(`Name: ${name}`);
            if (partySize) lines.push(`Party size: ${partySize}`);
            if (date) lines.push(`Preferred time: ${date}`);
            if (items) lines.push(`Order: ${items}`);
            if (notes) lines.push(`Special requests: ${notes}`);
        }
        const msg = encodeURIComponent(lines.join("\n"));
        return `https://wa.me/${toWaNumber(whatsapp)}?text=${msg}`;
    }

    const inputClass =
        "w-full border border-[var(--color-earth-100)] bg-white px-4 py-3.5 sm:py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/30 focus:outline-none focus:border-[var(--color-terracotta-400)] transition";

    const labelClass =
        "block text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-ink)]/50 mb-2";

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                window.open(buildWhatsAppURL(), "_blank", "noopener,noreferrer");
            }}
            className="space-y-5 border border-[var(--color-earth-100)] bg-white p-6 sm:p-8"
        >
            <div>
                <label htmlFor="reserve-name" className={labelClass}>
                    {t("nameLabel")}{" "}
                    <span aria-hidden="true" className="text-[var(--color-terracotta-500)]">
                        *
                    </span>
                </label>
                <input
                    id="reserve-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("namePlaceholder")}
                    className={inputClass}
                />
            </div>

            <div>
                <label htmlFor="reserve-party" className={labelClass}>
                    {t("partySizeLabel")}
                </label>
                <input
                    id="reserve-party"
                    type="number"
                    min={1}
                    max={100}
                    value={partySize}
                    onChange={(e) => setPartySize(e.target.value)}
                    placeholder={t("partySizePlaceholder")}
                    className={inputClass}
                />
            </div>

            <div>
                <label htmlFor="reserve-date" className={labelClass}>
                    {t("dateLabel")}
                </label>
                <input
                    id="reserve-date"
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder={t("datePlaceholder")}
                    className={inputClass}
                />
            </div>

            <div>
                <label htmlFor="reserve-items" className={labelClass}>
                    {t("itemsLabel")}{" "}
                    <span aria-hidden="true" className="text-[var(--color-terracotta-500)]">
                        *
                    </span>
                </label>
                <textarea
                    id="reserve-items"
                    required
                    rows={4}
                    value={items}
                    onChange={(e) => setItems(e.target.value)}
                    placeholder={t("itemsPlaceholder")}
                    className={`${inputClass} resize-y min-h-[100px]`}
                />
            </div>

            <div>
                <label htmlFor="reserve-notes" className={labelClass}>
                    {t("notesLabel")}
                </label>
                <textarea
                    id="reserve-notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("notesPlaceholder")}
                    className={`${inputClass} resize-y`}
                />
            </div>

            <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fb856] text-white font-semibold px-6 py-4 sm:py-3 transition-colors text-sm tracking-wide"
            >
                <MessageCircle size={20} />
                {t("submitBtn")}
            </button>
        </form>
    );
}
