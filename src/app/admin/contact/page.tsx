"use client";

import AdminShell from "@/components/admin/AdminShell";
import { useState, useEffect } from "react";

type ContactData = {
    phone: string;
    whatsapp: string;
    address: {
        street: string;
        area: string;
        city: string;
        dhakaStreet: string;
    };
    geo: { lat: number; lng: number };
    googleMapsDirectionsUrl: string;
    googleMapsEmbedUrl: string;
    hours: {
        weekdays: string;
        weekdaysBn: string;
        weekends: string;
        weekendsBn: string;
    };
    waitTime: { en: string; bn: string };
};

function Field({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
}) {
    return (
        <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
        </div>
    );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 pt-6 pb-1 border-t border-neutral-100 first:border-0 first:pt-0">
            {children}
        </h2>
    );
}

export default function ContactAdminPage() {
    const [data, setData] = useState<ContactData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState("");

    useEffect(() => {
        fetch("/api/admin/contact")
            .then((r) => r.json())
            .then((d) => {
                setData(d);
                setLoading(false);
            });
    }, []);

    function showToast(msg: string) {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    }

    function set(path: string[], value: string | number) {
        setData((prev) => {
            if (!prev) return prev;
            const next = JSON.parse(JSON.stringify(prev)) as ContactData;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let node: any = next;
            for (let i = 0; i < path.length - 1; i++) node = node[path[i]];
            node[path[path.length - 1]] = value;
            return next;
        });
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!data) return;
        setSaving(true);
        const res = await fetch("/api/admin/contact", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        const updated = await res.json();
        setData(updated);
        setSaving(false);
        showToast("Saved successfully.");
    }

    if (loading || !data) {
        return (
            <AdminShell>
                <div className="p-8 text-sm text-neutral-500">Loading…</div>
            </AdminShell>
        );
    }

    return (
        <AdminShell>
            <div className="p-6 sm:p-8 max-w-2xl">
                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-neutral-800">Contact & Hours</h1>
                    <p className="text-sm text-neutral-500 mt-0.5">
                        Updates apply to the public website immediately.
                    </p>
                </div>

                <form onSubmit={handleSave} className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                    <SectionHeading>Contact</SectionHeading>
                    <Field
                        label="Phone number"
                        value={data.phone}
                        onChange={(v) => set(["phone"], v)}
                        placeholder="+880 1X XXXX XXXX"
                    />
                    <Field
                        label="WhatsApp number (without +)"
                        value={data.whatsapp}
                        onChange={(v) => set(["whatsapp"], v)}
                        placeholder="8801XXXXXXXXX"
                    />

                    <SectionHeading>Rajshahi Address</SectionHeading>
                    <Field
                        label="Area / neighbourhood"
                        value={data.address.area}
                        onChange={(v) => set(["address", "area"], v)}
                        placeholder="Uposhohor"
                    />
                    <Field
                        label="Street / plot"
                        value={data.address.street}
                        onChange={(v) => set(["address", "street"], v)}
                        placeholder="House 12, Road 4"
                    />
                    <Field
                        label="City"
                        value={data.address.city}
                        onChange={(v) => set(["address", "city"], v)}
                        placeholder="Rajshahi"
                    />

                    <SectionHeading>Dhaka Outlet</SectionHeading>
                    <Field
                        label="Dhaka address (leave blank if not open yet)"
                        value={data.address.dhakaStreet === "TODO: Dhaka outlet address" ? "" : data.address.dhakaStreet}
                        onChange={(v) => set(["address", "dhakaStreet"], v)}
                        placeholder="Dhaka outlet address"
                    />

                    <SectionHeading>Map</SectionHeading>
                    <div className="grid grid-cols-2 gap-3">
                        <Field
                            label="Latitude"
                            value={String(data.geo.lat)}
                            onChange={(v) => set(["geo", "lat"], parseFloat(v) || 0)}
                            type="number"
                            placeholder="24.377892"
                        />
                        <Field
                            label="Longitude"
                            value={String(data.geo.lng)}
                            onChange={(v) => set(["geo", "lng"], parseFloat(v) || 0)}
                            type="number"
                            placeholder="88.598765"
                        />
                    </div>
                    <Field
                        label="Google Maps directions URL"
                        value={data.googleMapsDirectionsUrl}
                        onChange={(v) => set(["googleMapsDirectionsUrl"], v)}
                        placeholder="https://maps.google.com/?q=..."
                        type="url"
                    />

                    <SectionHeading>Opening Hours</SectionHeading>
                    <div className="grid grid-cols-2 gap-3">
                        <Field
                            label="Weekdays (English)"
                            value={data.hours.weekdays}
                            onChange={(v) => set(["hours", "weekdays"], v)}
                            placeholder="8:00 AM – 10:00 PM"
                        />
                        <Field
                            label="Weekdays (Bangla)"
                            value={data.hours.weekdaysBn}
                            onChange={(v) => set(["hours", "weekdaysBn"], v)}
                            placeholder="সকাল ৮টা – রাত ১০টা"
                        />
                        <Field
                            label="Weekends (English)"
                            value={data.hours.weekends}
                            onChange={(v) => set(["hours", "weekends"], v)}
                            placeholder="7:00 AM – 11:00 PM"
                        />
                        <Field
                            label="Weekends (Bangla)"
                            value={data.hours.weekendsBn}
                            onChange={(v) => set(["hours", "weekendsBn"], v)}
                            placeholder="সকাল ৭টা – রাত ১১টা"
                        />
                    </div>

                    <SectionHeading>Wait Time Banner</SectionHeading>
                    <Field
                        label="Wait time note (English)"
                        value={data.waitTime.en}
                        onChange={(v) => set(["waitTime", "en"], v)}
                        placeholder="Weekend evenings: expect 30–45 min wait."
                    />
                    <Field
                        label="Wait time note (Bangla)"
                        value={data.waitTime.bn}
                        onChange={(v) => set(["waitTime", "bn"], v)}
                        placeholder="সাপ্তাহিক ছুটির সন্ধ্যায়: ৩০–৪৫ মিনিট অপেক্ষা।"
                    />

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-neutral-900 hover:bg-neutral-700 disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
                        >
                            {saving ? "Saving…" : "Save changes"}
                        </button>
                    </div>
                </form>
            </div>

            {toast && (
                <div className="fixed bottom-6 right-6 bg-neutral-900 text-white text-sm px-4 py-2.5 rounded-lg shadow-lg">
                    {toast}
                </div>
            )}
        </AdminShell>
    );
}
