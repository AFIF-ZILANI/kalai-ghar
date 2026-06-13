import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { menuItems } from "@content/site-config";
import { siteConfig } from "@content/site-config";
import { formatPrice } from "@/lib/utils";
import type { MenuItem } from "@content/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("menu");
  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title: `${t("title")} — ${locale === "bn" ? "কালাই ঘর" : "Kalai Ghor"}`,
    description: t("subtitle"),
  };
}

const categoryOrder = ["ruti", "bhorta", "curry", "combo", "drink"] as const;

function groupByCategory(items: MenuItem[]) {
  return categoryOrder.reduce(
    (acc, cat) => {
      const filtered = items.filter((i) => i.category === cat);
      if (filtered.length) acc[cat] = filtered;
      return acc;
    },
    {} as Record<string, MenuItem[]>
  );
}

export default async function MenuPage() {
  const locale = await getLocale();
  const t = await getTranslations("menu");
  const common = await getTranslations("common");

  const grouped = groupByCategory(menuItems);

  const whatsappMsg = encodeURIComponent(
    locale === "bn"
      ? "নমস্কার কালাই ঘর! আমি মেনু দেখে অর্ডার দিতে চাই।"
      : "Hello Kalai Ghor! I'd like to order from the menu."
  );

  const categoryEmoji: Record<string, string> = {
    ruti: "🫓",
    bhorta: "🥬",
    curry: "🍲",
    combo: "🍽️",
    drink: "🍵",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-terracotta-700)]">
          {t("title")}
        </h1>
        <p className="mt-2 text-[var(--color-earth-800)]/70">{t("subtitle")}</p>
        <div className="w-20 h-1 bg-[var(--color-terracotta-500)] rounded-full mx-auto mt-4" />
      </div>

      <div className="space-y-14">
        {Object.entries(grouped).map(([cat, items]) => (
          <section key={cat} aria-labelledby={`cat-${cat}`}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl" aria-hidden="true">
                {categoryEmoji[cat]}
              </span>
              <h2
                id={`cat-${cat}`}
                className="text-xl sm:text-2xl font-bold text-[var(--color-earth-800)]"
              >
                {t(`categories.${cat as "ruti" | "bhorta" | "curry" | "combo" | "drink"}`)}
              </h2>
              <div className="flex-1 h-px bg-[var(--color-earth-100)]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col rounded-xl border border-[var(--color-earth-100)] bg-white p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="font-semibold text-[var(--color-earth-800)] leading-snug">
                      {locale === "bn" ? item.nameBn : item.nameEn}
                    </h3>
                    <span className="shrink-0 text-[var(--color-terracotta-600)] font-bold text-sm">
                      {item.price !== null
                        ? formatPrice(item.price, locale)
                        : "—"}
                    </span>
                  </div>

                  {/* Bilingual sub-name */}
                  <p className="text-xs text-[var(--color-earth-800)]/50 mt-0.5">
                    {locale === "bn" ? item.nameEn : item.nameBn}
                  </p>

                  {(locale === "bn" ? item.descriptionBn : item.descriptionEn) && (
                    <p className="mt-2 text-sm text-[var(--color-earth-800)]/70 leading-relaxed flex-1">
                      {locale === "bn" ? item.descriptionBn : item.descriptionEn}
                    </p>
                  )}

                  {item.price === null && (
                    <p className="mt-2 text-xs text-[var(--color-saffron-600)] italic">
                      {t("todoPriceNote")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-14 text-center">
        <p className="text-[var(--color-earth-800)]/70 mb-4 text-sm">
          {locale === "bn"
            ? "অর্ডার করতে WhatsApp-এ মেসেজ করুন বা ফোন করুন"
            : "Message us on WhatsApp to order or ask about prices"}
        </p>
        <a
          href={`https://wa.me/${siteConfig.whatsapp}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fb856] text-white font-semibold px-7 py-3 rounded-full shadow-md transition-colors"
        >
          <MessageCircle size={20} />
          {t("orderWhatsApp")}
        </a>
        <div className="mt-6">
          <Link
            href={`/${locale}/reserve`}
            className="text-sm text-[var(--color-terracotta-600)] hover:underline"
          >
            {locale === "bn" ? "আগাম অর্ডার করুন →" : "Pre-order for your visit →"}
          </Link>
        </div>
      </div>
    </div>
  );
}
