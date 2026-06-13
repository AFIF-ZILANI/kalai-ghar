"use client";

import { useTranslations } from "next-intl";
import { Phone, MessageCircle, MapPin } from "lucide-react";
import { siteConfig } from "@content/site-config";

export default function MobileBottomBar() {
    const t = useTranslations("mobileBar");

    const whatsappMsg = encodeURIComponent("নমস্কার, আমি একটি অর্ডার দিতে চাই।");

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-earth-900)] border-t border-[var(--color-earth-800)] safe-area-inset-bottom">
            <div className="grid grid-cols-3 divide-x divide-[var(--color-earth-800)]">
                <a
                    href={`tel:${siteConfig.phone}`}
                    className="flex flex-col items-center justify-center gap-1 py-3 text-[var(--color-earth-100)] hover:bg-[var(--color-earth-800)] transition-colors"
                >
                    <Phone size={20} className="text-[var(--color-saffron-400)]" />
                    <span className="text-[11px] font-medium">{t("call")}</span>
                </a>
                <a
                    href={`https://wa.me/${siteConfig.whatsapp}?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 py-3 bg-[var(--color-terracotta-600)] text-white hover:bg-[var(--color-terracotta-500)] transition-colors"
                >
                    <MessageCircle size={20} />
                    <span className="text-[11px] font-medium">{t("whatsapp")}</span>
                </a>
                <a
                    href={siteConfig.googleMapsDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 py-3 text-[var(--color-earth-100)] hover:bg-[var(--color-earth-800)] transition-colors"
                >
                    <MapPin size={20} className="text-[var(--color-saffron-400)]" />
                    <span className="text-[11px] font-medium">{t("directions")}</span>
                </a>
            </div>
        </div>
    );
}
