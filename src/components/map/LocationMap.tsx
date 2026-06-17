import { MapPin, ExternalLink } from "lucide-react";

type Props = {
    embedUrl: string;
    directionsUrl: string;
    /** Accessible label used as the iframe title and aria-label */
    label: string;
    height?: number;
};

/**
 * Server component — no client JS required.
 *
 * Validates the embed URL at render time so a TODO placeholder never
 * reaches the browser as a broken iframe. When a real URL is present,
 * renders a native lazy-loaded iframe with a persistent "Open in Maps"
 * overlay that keeps the Maps CTA accessible even inside the embed.
 *
 * To update the map: replace googleMapsEmbedUrl in content/site-config.ts
 * with the src value from Google Maps → Share → Embed a map.
 */
export default function LocationMap({ embedUrl, directionsUrl, label, height = 420 }: Props) {
    const isPlaceholder = !embedUrl || embedUrl.includes("TODO");

    return (
        <div className="relative overflow-hidden bg-[var(--color-earth-50)]" style={{ height }}>
            {isPlaceholder ? (
                <Placeholder directionsUrl={directionsUrl} />
            ) : (
                <>
                    <iframe
                        src={embedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={label}
                        aria-label={label}
                    />
                    <OpenInMapsButton href={directionsUrl} />
                </>
            )}
        </div>
    );
}

function Placeholder({ directionsUrl }: { directionsUrl: string }) {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[var(--color-earth-50)]">
            {/* Crosshair grid — visual stand-in for a map without leaning on a real image */}
            <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage:
                        "linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />
            <div className="relative flex flex-col items-center gap-4 text-center px-6">
                <MapPin size={32} className="text-[var(--color-terracotta-400)]" strokeWidth={1.5} />
                <div>
                    <p className="text-sm font-semibold text-[var(--color-ink)]/70">
                        Map pending confirmation
                    </p>
                    <p className="text-xs text-[var(--color-ink)]/40 mt-1">
                        Update <code className="font-mono">googleMapsEmbedUrl</code> in{" "}
                        <code className="font-mono">content/site-config.ts</code>
                    </p>
                </div>
                <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-terracotta-600)] border border-[var(--color-terracotta-200)] px-5 py-2.5 hover:bg-[var(--color-terracotta-50)] transition-colors"
                >
                    <ExternalLink size={12} />
                    Open in Google Maps
                </a>
            </div>
        </div>
    );
}

function OpenInMapsButton({ href }: { href: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 bg-white text-[var(--color-ink)] text-[11px] font-semibold uppercase tracking-widest px-3 py-2 shadow-md hover:bg-[var(--color-terracotta-600)] hover:text-white transition-colors"
        >
            <ExternalLink size={11} />
            Open in Maps
        </a>
    );
}
