"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ImageIcon, MapPinIcon, LogOutIcon, ExternalLinkIcon, UtensilsIcon } from "lucide-react";

const navItems = [
    { href: "/admin/menu", label: "Menu", icon: UtensilsIcon },
    { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/admin/contact", label: "Contact & Hours", icon: MapPinIcon },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    async function handleLogout() {
        await fetch("/api/admin/auth", { method: "DELETE" });
        router.push("/admin/login");
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-56 shrink-0 bg-white border-r border-neutral-200 flex flex-col">
                <div className="px-5 py-5 border-b border-neutral-100">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
                        Admin
                    </p>
                    <p className="text-base font-semibold text-neutral-800 mt-0.5">Kalai Ghor</p>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-0.5">
                    {navItems.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    active
                                        ? "bg-neutral-900 text-white"
                                        : "text-neutral-600 hover:bg-neutral-100"
                                }`}
                            >
                                <Icon size={15} strokeWidth={2} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="px-3 py-4 border-t border-neutral-100 space-y-0.5">
                    <a
                        href="/en"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-neutral-500 hover:bg-neutral-100 transition-colors"
                    >
                        <ExternalLinkIcon size={15} strokeWidth={2} />
                        View site
                    </a>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-neutral-500 hover:bg-neutral-100 transition-colors"
                    >
                        <LogOutIcon size={15} strokeWidth={2} />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-auto">{children}</main>
        </div>
    );
}
