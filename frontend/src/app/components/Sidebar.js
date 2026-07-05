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

    async function logout() {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
                method: "GET",
                credentials: "include",
            });
        } catch (err) {
            console.error(err);
        } finally {
            window.location.href = "/";
        }
    }

    return (
        <aside
            className="hidden md:flex w-60 flex-col justify-between shrink-0 sticky top-0 h-screen overflow-y-auto"
            style={{ backgroundColor: "#12141C", color: "#9497AB" }}
        >
            <div>
                <div
                    className="flex items-center gap-2.5 px-6 py-6"
                    style={{ borderBottom: "1px solid #1A1D28" }}
                >
                    <Logo />
                    <span
                        className="text-[15px] font-medium tracking-tight"
                        style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#ECEDF3" }}
                    >
                        Automater
                    </span>
                </div>

                <nav className="px-3 py-5 space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
                                style={
                                    active
                                        ? { backgroundColor: "rgba(124,111,224,0.15)", color: "#ECEDF3" }
                                        : { color: "#9497AB" }
                                }
                                onMouseEnter={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
                                        e.currentTarget.style.color = "#ECEDF3";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.backgroundColor = "transparent";
                                        e.currentTarget.style.color = "#9497AB";
                                    }
                                }}
                            >
                                <NavIcon name={item.icon} active={active} />
                                {item.label}
                                {active && (
                                    <span
                                        className="ml-auto w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: "#7C6FE0" }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="px-6 py-5 shrink-0" style={{ borderTop: "1px solid #1A1D28" }}>
                <p
                    className="text-[11px] uppercase tracking-wider font-medium"
                    style={{ color: "#4C5164" }}
                >
                    Signed in via
                </p>
                <p className="text-sm mt-1" style={{ color: "#C7C9D9" }}>GitHub</p>

                <button
                    onClick={logout}
                    className="mt-4 w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors"
                    style={{ color: "#9497AB" }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
                        e.currentTarget.style.color = "#ECEDF3";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#9497AB";
                    }}
                >
                    <LogoutIcon />
                    Log out
                </button>
            </div>
        </aside>
    );
}

function Logo() {
    return (
        <div
            className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#7C6FE0" }}
        >
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
        </div>
    );
}

function LogoutIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 shrink-0"
        >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
        </svg>
    );
}

function NavIcon({ name, active }) {
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
            className="w-4 h-4 shrink-0"
            style={{ color: active ? "#7C6FE0" : "currentColor" }}
        >
            {icons[name]}
        </svg>
    );
}