"use client";

import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function AppShell({ title, description, actions, children }) {
    return (
        <div className="min-h-screen flex relative" style={{ backgroundColor: "#0A0C12" }}>
            <style>{`
                @keyframes driftOne {
                    0%   { transform: translate(-10%, -10%) scale(1); }
                    50%  { transform: translate(8%, 12%) scale(1.15); }
                    100% { transform: translate(-10%, -10%) scale(1); }
                }
                @keyframes driftTwo {
                    0%   { transform: translate(10%, 15%) scale(1); }
                    50%  { transform: translate(-12%, -8%) scale(1.1); }
                    100% { transform: translate(10%, 15%) scale(1); }
                }
                .ambient-blob-one {
                    animation: driftOne 32s ease-in-out infinite;
                }
                .ambient-blob-two {
                    animation: driftTwo 38s ease-in-out infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .ambient-blob-one, .ambient-blob-two {
                        animation: none !important;
                    }
                }
            `}</style>

            {/* Ambient background layer */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="ambient-blob-one absolute rounded-full"
                    style={{
                        width: 560,
                        height: 560,
                        top: "-8%",
                        left: "10%",
                        background: "radial-gradient(circle, rgba(124,111,224,0.07), transparent 70%)",
                        filter: "blur(60px)",
                    }}
                />
                <div
                    className="ambient-blob-two absolute rounded-full"
                    style={{
                        width: 480,
                        height: 480,
                        bottom: "-10%",
                        right: "8%",
                        background: "radial-gradient(circle, rgba(95,191,143,0.06), transparent 70%)",
                        filter: "blur(60px)",
                    }}
                />
            </div>

            <div className="relative z-10 flex w-full">
                <Sidebar />

                <div className="flex-1 flex flex-col min-w-0">
                    <header
                        className="sticky top-0 z-10 backdrop-blur px-6 md:px-10 py-5 flex items-center justify-between gap-4"
                        style={{
                            backgroundColor: "rgba(10,12,18,0.85)",
                            borderBottom: "1px solid #1A1D28",
                        }}
                    >
                        <div className="min-w-0">
                            <h1
                                className="text-2xl font-semibold tracking-tight"
                                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#ECEDF3" }}
                            >
                                {title}
                            </h1>
                            {description && (
                                <p
                                    className="text-sm mt-0.5"
                                    style={{ color: "#6E7286", fontFamily: "'Inter', sans-serif" }}
                                >
                                    {description}
                                </p>
                            )}
                        </div>
                        {actions && <div className="shrink-0 flex items-center gap-3">{actions}</div>}
                    </header>

                    <main className="flex-1 px-6 md:px-10 py-8">{children}</main>

                    <MobileNav />
                </div>
            </div>
        </div>
    );
}