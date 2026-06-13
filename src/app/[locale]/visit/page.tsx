import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Phone, MapPin, Clock, Star } from "lucide-react";
import { siteConfig } from "@content/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("visit");
  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title: `${t("title")} — ${locale === "bn" ? "কালাই ঘর" : "Kalai Ghor"}`,
  };
}

export default async function VisitPage() {
  const locale = await getLocale();
  const t = await getTranslations("visit");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-terracotta-700)]">
          {t("title")}
        </h1>
        <div className="w-20 h-1 bg-[var(--color-terracotta-500)] rounded-full mx-auto mt-4" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Address */}
        <section className="rounded-2xl border border-[var(--color-earth-100)] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <MapPin size={20} className="text-[var(--color-terracotta-600)]" />
            <h2 className="font-bold text-[var(--color-earth-800)] text-lg">{t("addressTitle")}</h2>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-terracotta-500)] mb-1">
                {t("rajshahiOutlet")}
              </p>
              <p className="text-[var(--color-earth-800)]">
                {siteConfig.address.area}, {siteConfig.address.city}
              </p>
              <p className="text-sm text-[var(--color-earth-800)]/60">
                {locale === "bn" ? "রাজশাহী, বাংলাদেশ" : "Rajshahi, Bangladesh"}
              </p>
              {/* TODO: exact street address from owner */}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-terracotta-500)] mb-1">
                {t("dhakaOutlet")}
              </p>
              <p className="text-sm text-[var(--color-earth-800)]/70 italic">
                {siteConfig.address.dhakaStreet}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href={siteConfig.googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[var(--color-terracotta-600)] hover:bg-[var(--color-terracotta-700)] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <MapPin size={16} />
              {t("directionsBtn")}
            </a>
            <a
              href={`tel:${siteConfig.phone}`}
              className="flex-1 flex items-center justify-center gap-2 border border-[var(--color-terracotta-300)] text-[var(--color-terracotta-600)] hover:bg-[var(--color-terracotta-50)] text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Phone size={16} />
              {t("callBtn")}
            </a>
          </div>
        </section>

        {/* Hours + Wait */}
        <section className="rounded-2xl border border-[var(--color-earth-100)] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Clock size={20} className="text-[var(--color-terracotta-600)]" />
            <h2 className="font-bold text-[var(--color-earth-800)] text-lg">{t("hoursTitle")}</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-[var(--color-earth-100)]">
              <span className="text-sm text-[var(--color-earth-800)]">{t("weekdays")}</span>
              <span className="text-sm font-medium text-[var(--color-earth-800)]">
                {locale === "bn"
                  ? siteConfig.hours.weekdaysBn
                  : siteConfig.hours.weekdays}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-[var(--color-earth-800)]">{t("weekends")}</span>
              <span className="text-sm font-medium text-[var(--color-earth-800)]">
                {locale === "bn"
                  ? siteConfig.hours.weekendsBn
                  : siteConfig.hours.weekends}
              </span>
            </div>
          </div>

          {/* Best time tip */}
          <div className="mt-6 rounded-xl bg-[var(--color-terracotta-50)] border border-[var(--color-terracotta-100)] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star size={14} className="text-[var(--color-saffron-500)]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-terracotta-600)]">
                {t("bestTimeTitle")}
              </span>
            </div>
            <p className="text-sm text-[var(--color-earth-800)]/80 leading-relaxed">
              {t("bestTimeBody")}
            </p>
          </div>

          {/* Wait time */}
          <div className="mt-4 rounded-xl bg-[var(--color-saffron-400)]/10 border border-[var(--color-saffron-400)]/30 p-4">
            <p className="text-xs font-semibold text-[var(--color-saffron-600)] mb-1">
              {locale === "bn" ? "আনুমানিক অপেক্ষার সময়" : "Typical wait time"}
            </p>
            <p className="text-sm text-[var(--color-earth-800)]/80">
              {siteConfig.waitTime[locale as "bn" | "en"]}
            </p>
          </div>
        </section>
      </div>

      {/* Map embed placeholder */}
      <div className="mt-10 rounded-2xl overflow-hidden border border-[var(--color-earth-100)] shadow-sm">
        <div className="bg-[var(--color-earth-100)] h-80 flex items-center justify-center">
          <div className="text-center text-[var(--color-earth-800)]/60 px-6">
            <MapPin size={40} className="mx-auto mb-3 text-[var(--color-terracotta-400)]" />
            <p className="text-sm font-medium">
              {locale === "bn" ? "গুগল ম্যাপ" : "Google Maps"}
            </p>
            <p className="text-xs mt-1 italic max-w-xs mx-auto">
              {locale === "bn"
                ? "TODO: site-config.ts-এ googleMapsEmbedUrl আপডেট করুন, তারপর এখানে iframe যোগ করুন"
                : "TODO: Update googleMapsEmbedUrl in content/site-config.ts, then replace this block with an iframe"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
