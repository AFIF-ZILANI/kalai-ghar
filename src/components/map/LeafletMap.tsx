"use client";

import { useEffect, useRef } from "react";
import type { Map as LMap } from "leaflet";

type Props = {
    lat: number;
    lng: number;
    zoom?: number;
    label: string;
    popupHtml: string;
    directionsUrl: string;
};

/**
 * Leaflet map with CartoDB Voyager tiles (warm earth tones — no Google branding).
 * Loaded only on the client. The parent uses next/dynamic with ssr:false.
 */
export default function LeafletMap({ lat, lng, zoom = 16, label, popupHtml }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<LMap | null>(null);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        // Leaflet must load after mount (requires window)
        import("leaflet").then((L) => {
            import("leaflet/dist/leaflet.css");

            const map = L.map(containerRef.current!, {
                center: [lat, lng],
                zoom,
                zoomControl: false,
                scrollWheelZoom: false,
                attributionControl: false,
            });

            mapRef.current = map;

            // CartoDB Voyager — warm beige/tan tones, no Google branding
            L.tileLayer(
                "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
                { subdomains: "abcd", maxZoom: 20 },
            ).addTo(map);

            // Minimal attribution in bottom-right
            L.control
                .attribution({ prefix: false, position: "bottomright" })
                .addAttribution('&copy; <a href="https://carto.com/">CARTO</a>')
                .addTo(map);

            // Zoom control — top-right, away from the info overlay
            L.control.zoom({ position: "topright" }).addTo(map);

            // Custom terracotta SVG pin
            const pin = L.divIcon({
                html: `
                    <svg width="30" height="42" viewBox="0 0 30 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 0C6.716 0 0 6.716 0 15C0 25.5 15 42 15 42C15 42 30 25.5 30 15C30 6.716 23.284 0 15 0Z" fill="#b84520"/>
                        <circle cx="15" cy="15" r="6" fill="white" fill-opacity="0.95"/>
                        <circle cx="15" cy="15" r="3" fill="#b84520"/>
                    </svg>
                `,
                className: "",
                iconSize: [30, 42],
                iconAnchor: [15, 42],
                popupAnchor: [0, -44],
            });

            // Popup styled to match brand
            const popup = L.popup({
                className: "kg-popup",
                maxWidth: 220,
                minWidth: 180,
                closeButton: false,
            }).setContent(popupHtml);

            L.marker([lat, lng], { icon: pin }).addTo(map).bindPopup(popup).openPopup();
        });

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <style>{`
                /* Popup brand styling */
                .kg-popup .leaflet-popup-content-wrapper {
                    background: #1a1007;
                    color: #fdf8f2;
                    border-radius: 0;
                    border: 1px solid rgba(255,255,255,0.08);
                    box-shadow: 0 4px 24px rgba(0,0,0,0.4);
                    font-family: inherit;
                    padding: 0;
                }
                .kg-popup .leaflet-popup-content {
                    margin: 0;
                    padding: 14px 16px;
                }
                .kg-popup .leaflet-popup-tip-container {
                    display: none;
                }
                /* Zoom controls */
                .leaflet-control-zoom {
                    border: none !important;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
                    border-radius: 0 !important;
                }
                .leaflet-control-zoom a {
                    background: #1a1007 !important;
                    color: rgba(253,248,242,0.7) !important;
                    border: none !important;
                    border-radius: 0 !important;
                    width: 32px !important;
                    height: 32px !important;
                    line-height: 32px !important;
                    font-size: 16px !important;
                    transition: color 0.15s !important;
                }
                .leaflet-control-zoom a:hover {
                    color: #e87f50 !important;
                    background: #261c0d !important;
                }
                .leaflet-control-zoom-in {
                    margin-bottom: 1px !important;
                }
                /* Attribution */
                .leaflet-control-attribution {
                    background: rgba(26,16,7,0.7) !important;
                    color: rgba(253,248,242,0.35) !important;
                    font-size: 9px !important;
                    padding: 2px 6px !important;
                    border-radius: 0 !important;
                }
                .leaflet-control-attribution a {
                    color: rgba(253,248,242,0.45) !important;
                }
            `}</style>
            <div ref={containerRef} style={{ width: "100%", height: "100%" }} aria-label={label} />
        </>
    );
}
