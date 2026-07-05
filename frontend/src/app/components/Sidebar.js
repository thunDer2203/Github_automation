"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: "grid" },
    { href: "/repositories", label: "Repositories", icon: "repo" },
    { href: "/connected", label: "Connected", icon: "link" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex w-60 flex-col justify-between bg-[#14161F] text-[#C7C9D9] shrink-0">
            <div>
                <div className="flex items-center gap-2.5 px-6 py-6 border-b border-white/5">
                    <Logo />
                    <span className="font-['Space_Grotesk'] text-[15px] font-medium text-white tracking-tight">
                        GitHub Automation
                    </span>
                </div>

                <nav className="px-3 py-5 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                    active
                                        ? "bg-[#5B5FEF]/15 text-white"
                                        : "text-[#9497AB] hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <NavIcon name={item.icon} active={active} />
                                {item.label}
                                {active && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#8B8EFB]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="px-6 py-5 border-t border-white/5">
                <p className="text-[11px] uppercase tracking-wider text-[#5F6274] font-medium">
                    Signed in via
                </p>
                <p className="text-sm text-[#C7C9D9] mt-1">GitHub</p>
            </div>
        </aside>
    );
}

function Logo() {
    return (
        <div className="w-7 h-7 rounded-md bg-[#5B5FEF] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
        </div>
    );
}

function NavIcon({ name, active }) {
    const className = `w-4 h-4 shrink-0 ${active ? "text-[#8B8EFB]" : ""}`;
    const icons = {
        grid: (
            <>
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </>
        ),
        repo: <path d="M4 4h13a2 2 0 0 1 2 2v14l-8.5-4L4 20V4Z" />,
        link: (
            <>
                <path d="M9 15l6-6" />
                <path d="M11 5.5 12.5 4A4 4 0 0 1 18 9.5L16.5 11" />
                <path d="M13 18.5 11.5 20A4 4 0 0 1 6 14.5L7.5 13" />
            </>
        ),
    };

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {icons[name]}
        </svg>
    );
}