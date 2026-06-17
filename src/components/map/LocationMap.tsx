"use client";

import dynamic from "next/dynamic";
import { ExternalLink, MapPin } from "lucide-react";

// Leaflet requires window — load only on client
const LeafletMap = dynamic(() => import("./LeafletMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-[var(--color-earth-50)] animate-pulse flex items-center justify-center">
            <MapPin size={24} className="text-[var(--color-terracotta-400)] opacity-40" strokeWidth={1.5} />
        </div>
    ),
});

type Props = {
    lat: number;
    lng: number;
    directionsUrl: string;
    label: string;
    /** Bilingual name shown in the popup */
    name: string;
    /** Bilingual address line */
    address: string;
    /** Leave undefined when the parent element controls height via CSS */
    height?: number;
};

export default function LocationMap({
    lat,
    lng,
    directionsUrl,
    label,
    name,
    address,
    height,
}: Props) {
    const popupHtml = `
        <div style="line-height:1.5">
            <p style="font-size:13px;font-weight:600;color:#fdf8f2;margin:0 0 2px">${name}</p>
            <p style="font-size:11px;color:rgba(253,248,242,0.5);margin:0 0 10px">${address}</p>
            <a
                href="${directionsUrl}"
                target="_blank"
                rel="noopener noreferrer"
                style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;
                       letter-spacing:0.06em;text-transform:uppercase;color:#e87f50;
                       text-decoration:none;border-bottom:1px solid rgba(232,127,80,0.3);
                       padding-bottom:1px;"
            >
                Open in Google Maps
            </a>
        </div>
    `;

    return (
        <div className="relative overflow-hidden" style={height !== undefined ? { height } : { height: "100%" }}>
            <LeafletMap
                lat={lat}
                lng={lng}
                label={label}
                popupHtml={popupHtml}
                directionsUrl={directionsUrl}
            />
            {/* Always-visible "Open in Maps" — accessible even when popup is closed */}
            <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 left-4 z-[1000] inline-flex items-center gap-1.5 bg-[var(--color-ink)] text-[var(--color-cream)] text-[11px] font-semibold uppercase tracking-widest px-3 py-2 hover:bg-[var(--color-terracotta-600)] transition-colors shadow-md"
            >
                <ExternalLink size={11} />
                Open in Maps
            </a>
        </div>
    );
}
