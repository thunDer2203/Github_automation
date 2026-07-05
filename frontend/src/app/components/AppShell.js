"use client";

import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function AppShell({ title, description, actions, children }) {
    return (
        <div className="min-h-screen flex relative" style={{ backgroundColor: "#0A0C12" }}>
            <style>{`
                @keyframes driftOne {
                    0%   { transform: translate(-10%, -10%) scale(1); }
                    50%  { transform: translate(15%, 20%) scale(1.3); }
                    100% { transform: translate(-10%, -10%) scale(1); }
                }
                @keyframes driftTwo {
                    0%   { transform: translate(10%, 15%) scale(1); }
                    50%  { transform: translate(-18%, -12%) scale(1.25); }
                    100% { transform: translate(10%, 15%) scale(1); }
                }
                @keyframes driftThree {
                    0%   { transform: translate(0%, 0%) scale(1); }
                    50%  { transform: translate(10%, -15%) scale(1.2); }
                    100% { transform: translate(0%, 0%) scale(1); }
                }
                .ambient-blob-one { animation: driftOne 26s ease-in-out infinite; }
                .ambient-blob-two { animation: driftTwo 32s ease-in-out infinite; }
                .ambient-blob-three { animation: driftThree 22s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) {
                    .ambient-blob-one, .ambient-blob-two, .ambient-blob-three {
                        animation: none !important;
                    }
                }
            `}</style>

            {/* Ambient background layer — fixed so it always sits behind content */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
                <div
                    className="ambient-blob-one absolute rounded-full"
                    style={{
                        width: 700,
                        height: 700,
                        top: "-10%",
                        left: "5%",
                        background: "radial-gradient(circle, rgba(124,111,224,0.22), transparent 70%)",
                        filter: "blur(80px)",
                    }}
                />
                <div
                    className="ambient-blob-two absolute rounded-full"
                    style={{
                        width: 620,
                        height: 620,
                        bottom: "-15%",
                        right: "0%",
                        background: "radial-gradient(circle, rgba(95,191,143,0.18), transparent 70%)",
                        filter: "blur(80px)",
                    }}
                />
                <div
                    className="ambient-blob-three absolute rounded-full"
                    style={{
                        width: 500,
                        height: 500,
                        top: "35%",
                        left: "45%",
                        background: "radial-gradient(circle, rgba(227,168,87,0.10), transparent 70%)",
                        filter: "blur(90px)",
                    }}
                />
            </div>

            <div className="relative flex w-full" style={{ zIndex: 1 }}>
                <Sidebar />

                <div className="flex-1 flex flex-col min-w-0">
                    <header
                        className="sticky top-0 backdrop-blur px-6 md:px-10 py-5 flex items-center justify-between gap-4"
                        style={{
                            zIndex: 2,
                            backgroundColor: "rgba(10,12,18,0.75)",
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