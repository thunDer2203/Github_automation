"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/repositories", label: "Repositories" },
    { href: "/connected", label: "Connected" },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden sticky bottom-0 z-10 bg-white border-t border-[#E4E4EA] flex justify-around px-2 py-2">
            {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`text-xs font-medium px-3 py-2 rounded-lg transition-colors ${
                            active
                                ? "text-[#5B5FEF] bg-[#EEF0FF]"
                                : "text-[#6B6F80]"
                        }`}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}