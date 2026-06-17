import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Phone, MapPin, Clock, Star } from "lucide-react";
import { siteConfig } from "@content/site-config";
import LocationMap from "@/components/map/LocationMap";
import { getContactData } from "@/lib/server/contact";

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
    const contact = getContactData();

    const mapLabel =
        locale === "bn"
            ? `কালাই ঘর — ${contact.address.area}, রাজশাহী`
            : `Kalai Ghor — ${contact.address.area}, Rajshahi`;

    return (
        <>
            <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-20">
                {/* Page header */}
                <div className="mb-10 sm:mb-14">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-terracotta-500)] mb-3">
                        {locale === "bn" ? "আমাদের খুঁজুন" : "Find Us"}
                    </p>
                    <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[var(--color-ink)] leading-tight">
                        {t("title")}
                    </h1>
                    <div className="mt-4 w-10 h-px bg-[var(--color-terracotta-400)]" />
                </div>

                {/* Info grid */}
                <div className="grid md:grid-cols-2 gap-px bg-[var(--color-earth-100)]">
                    {/* Address */}
                    <section className="bg-[var(--color-cream)] p-6 sm:p-8">
                        <div className="flex items-center gap-2.5 mb-6">
                            <MapPin size={15} className="text-[var(--color-terracotta-500)]" strokeWidth={2} />
                            <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]/50">
                                {t("addressTitle")}
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-terracotta-500)] mb-1.5">
                                    {t("rajshahiOutlet")}
                                </p>
                                <p className="font-display text-xl font-semibold text-[var(--color-ink)] leading-snug">
                                    {contact.address.area}
                                </p>
                                <p className="text-sm text-[var(--color-ink)]/50 mt-0.5">
                                    {contact.address.city},{" "}
                                    {locale === "bn" ? "বাংলাদেশ" : "Bangladesh"}
                                </p>
                            </div>

                            <div className="border-t border-[var(--color-earth-100)] pt-5">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-terracotta-500)] mb-1.5">
                                    {t("dhakaOutlet")}
                                </p>
                                <p className="text-sm text-[var(--color-ink)]/50 italic">
                                    {!contact.address.dhakaStreet ||
                                    contact.address.dhakaStreet === "TODO: Dhaka outlet address"
                                        ? locale === "bn"
                                            ? "শীঘ্রই আসছে"
                                            : "Coming soon"
                                        : contact.address.dhakaStreet}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <a
                                href={contact.googleMapsDirectionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 bg-[var(--color-ink)] hover:bg-[var(--color-terracotta-700)] text-white text-[11px] font-semibold uppercase tracking-widest px-4 py-4 sm:py-3 transition-colors"
                            >
                                <MapPin size={13} />
                                {t("directionsBtn")}
                            </a>
                            <a
                                href={`tel:${contact.phone}`}
                                className="flex-1 flex items-center justify-center gap-2 border border-[var(--color-ink)]/15 text-[var(--color-ink)]/70 hover:border-[var(--color-ink)]/40 hover:text-[var(--color-ink)] text-[11px] font-semibold uppercase tracking-widest px-4 py-4 sm:py-3 transition-colors"
                            >
                                <Phone size={13} />
                                {t("callBtn")}
                            </a>
                        </div>
                    </section>

                    {/* Hours */}
                    <section className="bg-[var(--color-cream)] p-6 sm:p-8">
                        <div className="flex items-center gap-2.5 mb-6">
                            <Clock size={15} className="text-[var(--color-terracotta-500)]" strokeWidth={2} />
                            <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink)]/50">
                                {t("hoursTitle")}
                            </h2>
                        </div>

                        <div>
                            <div className="flex justify-between items-baseline py-3.5 border-b border-[var(--color-earth-100)]">
                                <span className="text-sm text-[var(--color-ink)]/60">{t("weekdays")}</span>
                                <span className="font-display text-base font-semibold text-[var(--color-ink)]">
                                    {locale === "bn" ? contact.hours.weekdaysBn : contact.hours.weekdays}
                                </span>
                            </div>
                            <div className="flex justify-between items-baseline py-3.5">
                                <span className="text-sm text-[var(--color-ink)]/60">{t("weekends")}</span>
                                <span className="font-display text-base font-semibold text-[var(--color-ink)]">
                                    {locale === "bn" ? contact.hours.weekendsBn : contact.hours.weekends}
                                </span>
                            </div>
                        </div>

                        <div className="mt-5 border-l-2 border-[var(--color-saffron-400)] pl-4">
                            <div className="flex items-center gap-2 mb-1.5">
                                <Star size={11} className="text-[var(--color-saffron-500)]" />
                                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-ink)]/50">
                                    {t("bestTimeTitle")}
                                </span>
                            </div>
                            <p className="text-sm text-[var(--color-ink)]/60 leading-relaxed">
                                {t("bestTimeBody")}
                            </p>
                        </div>

                        <div className="mt-5 bg-[var(--color-earth-50)] border border-[var(--color-earth-100)] px-4 py-3.5">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-ink)]/40 mb-1">
                                {locale === "bn" ? "আনুমানিক অপেক্ষার সময়" : "Typical wait"}
                            </p>
                            <p className="text-sm text-[var(--color-ink)]/70">
                                {contact.waitTime[locale as "bn" | "en"]}
                            </p>
                        </div>
                    </section>
                </div>
            </div>

            {/* Map */}
            <div className="w-full h-[55svh] sm:h-[500px]">
                <LocationMap
                    lat={contact.geo.lat}
                    lng={contact.geo.lng}
                    directionsUrl={contact.googleMapsDirectionsUrl}
                    label={mapLabel}
                    name={locale === "bn" ? "কালাই ঘর" : "Kalai Ghor"}
                    address={`${contact.address.area}, ${contact.address.city}`}
                    height={undefined}
                />
            </div>

            <div className="pb-6 sm:pb-0" />
        </>
    );
}
