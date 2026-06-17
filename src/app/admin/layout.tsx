import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
    title: "Admin — Kalai Ghor",
    robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable} h-full antialiased`}>
            <body className="min-h-full bg-neutral-100 text-neutral-900">{children}</body>
        </html>
    );
}
