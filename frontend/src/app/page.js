"use client";

export default function Home() {
    const login = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/github`;
    };

    return (
        <main className="min-h-screen flex flex-col lg:flex-row" style={{ backgroundColor: "#0A0C12" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

                @keyframes pop {
                  0% { opacity: 0; transform: scale(.35); }
                  5% { opacity: 1; transform: scale(1.15); }
                  8% { transform: scale(1); }
                  100% { opacity: 1; transform: scale(1); }
                }
                @keyframes draw {
                  0% { stroke-dashoffset: 240; }
                  15% { stroke-dashoffset: 0; }
                  100% { stroke-dashoffset: 0; }
                }
                @keyframes cycleFade {
                  0% { opacity: 1; }
                  92% { opacity: 1; }
                  96% { opacity: 0; }
                  100% { opacity: 0; }
                }
                .graph-cycle { animation: cycleFade 6s linear infinite; }
                .g-dot { opacity: 0; animation: pop 6s ease-out infinite; transform-origin: center; }
                .g-branch { stroke-dasharray: 240; stroke-dashoffset: 240; animation: draw 6s ease-out infinite; }
                .g-badge { opacity: 0; animation: pop 6s ease-out infinite; transform-origin: center; }

                @media (prefers-reduced-motion: reduce) {
                  .graph-cycle, .g-dot, .g-branch, .g-badge {
                    animation: none !important;
                    opacity: 1 !important;
                    stroke-dashoffset: 0 !important;
                    transform: none !important;
                  }
                }
            `}</style>

            {/* Sign-in section */}
            <section
                className="w-full lg:w-[440px] flex items-center justify-center px-8 py-16 lg:py-0 order-2 lg:order-1"
                style={{ backgroundColor: "#12141C" }}
            >
                <div className="w-full max-w-[340px]">
                    <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center mb-8"
                        style={{ backgroundColor: "rgba(124,111,224,0.12)" }}
                    >
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <circle cx="6" cy="6" r="2.4" fill="#7C6FE0" />
                            <circle cx="18" cy="17" r="2.4" fill="#5FBF8F" />
                            <path d="M6 8.4 C 6 14, 12 14, 18 14.6" stroke="#7C6FE0" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                        </svg>
                    </div>

                    <h1
                        style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#ECEDF3" }}
                        className="text-[32px] font-semibold leading-[1.15] tracking-tight"
                    >
                        Your repo, minus the busywork.
                    </h1>

                    <p style={{ color: "#6E7286", fontFamily: "'Inter', sans-serif" }} className="mt-3 text-[15px] leading-relaxed">
                        Connect GitHub events to actions — labels, comments, Slack pings — without writing a workflow file.
                    </p>

                    <button
                        onClick={login}
                        className="w-full inline-flex items-center justify-center gap-2.5 rounded-lg cursor-pointer px-6 py-3 text-sm font-medium mt-9 transition-colors"
                        style={{ backgroundColor: "#ECEDF3", color: "#0A0C12" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#D5D7E0")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ECEDF3")}
                    >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55v-2.17c-3.2.7-3.88-1.35-3.88-1.35-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.74.4-1.26.72-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.39-5.25 5.67.42.36.78 1.07.78 2.17v3.22c0 .3.21.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
                        </svg>
                        Continue with GitHub
                    </button>

                    <p style={{ color: "#4E5164", fontFamily: "'Inter', sans-serif" }} className="text-xs mt-5 leading-relaxed">
                        Read-only access to the repos you choose to connect.
                    </p>
                </div>
            </section>

            {/* Visualization + about section */}
            <section className="flex-1 relative flex flex-col items-center justify-center px-8 py-16 overflow-hidden order-1 lg:order-2 min-h-[560px] lg:min-h-screen">
                <div
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        width: 520,
                        height: 520,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        background: "radial-gradient(circle, rgba(124,111,224,0.08), transparent 70%)",
                    }}
                />

                <div className="graph-cycle relative w-full max-w-[380px]">
                    <svg viewBox="0 0 360 460" className="w-full h-auto relative z-10">
                        <line x1="48" y1="20" x2="48" y2="440" stroke="#262B3A" strokeWidth="2" />

                        <circle className="g-dot" cx="48" cy="60" r="6" fill="#4C5164" style={{ animationDelay: "0s" }} />
                        <circle className="g-dot" cx="48" cy="140" r="6" fill="#4C5164" style={{ animationDelay: "0.5s" }} />
                        <circle className="g-dot" cx="48" cy="220" r="7" fill="#7C6FE0" style={{ animationDelay: "1s" }} />
                        <circle className="g-dot" cx="48" cy="300" r="6" fill="#4C5164" style={{ animationDelay: "1.6s" }} />
                        <circle className="g-dot" cx="48" cy="380" r="6" fill="#4C5164" style={{ animationDelay: "2.1s" }} />

                        <path
                            className="g-branch"
                            d="M48,220 C140,220 150,178 236,178"
                            stroke="#5FBF8F"
                            strokeWidth="2"
                            fill="none"
                            style={{ animationDelay: "1.4s" }}
                        />
                        <path
                            className="g-branch"
                            d="M254,190 C300,210 254,270 250,318"
                            stroke="#E3A857"
                            strokeWidth="2"
                            fill="none"
                            style={{ animationDelay: "2.5s" }}
                        />
                    </svg>

                    <div
                        className="g-badge absolute px-3 py-1.5 rounded-md text-[11px] font-medium"
                        style={{
                            left: "64%",
                            top: "36%",
                            fontFamily: "'JetBrains Mono', monospace",
                            backgroundColor: "rgba(95,191,143,0.12)",
                            color: "#5FBF8F",
                            border: "1px solid rgba(95,191,143,0.3)",
                            animationDelay: "2.3s",
                        }}
                    >
                        label: needs-triage
                    </div>

                    <div
                        className="g-badge absolute px-3 py-1.5 rounded-md text-[11px] font-medium"
                        style={{
                            left: "66%",
                            top: "63%",
                            fontFamily: "'JetBrains Mono', monospace",
                            backgroundColor: "rgba(227,168,87,0.12)",
                            color: "#E3A857",
                            border: "1px solid rgba(227,168,87,0.3)",
                            animationDelay: "3.5s",
                        }}
                    >
                        #alerts ✓
                    </div>
                </div>

                <div className="relative z-10 mt-10 w-full max-w-[380px]">
                    <p style={{ color: "#4C5164", fontFamily: "'JetBrains Mono', monospace" }} className="text-[11px] mb-3">
                        # a few things it can do
                    </p>
                    <div className="space-y-2.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        <p className="text-[12px]">
                            <span style={{ color: "#7C6FE0" }}>on:</span>{" "}
                            <span style={{ color: "#6E7286" }}>issue.opened</span>{" "}
                            <span style={{ color: "#4C5164" }}>→</span>{" "}
                            <span style={{ color: "#5FBF8F" }}>label "needs-triage"</span>
                        </p>
                        <p className="text-[12px]">
                            <span style={{ color: "#7C6FE0" }}>on:</span>{" "}
                            <span style={{ color: "#6E7286" }}>pr.merged</span>{" "}
                            <span style={{ color: "#4C5164" }}>→</span>{" "}
                            <span style={{ color: "#ECEDF3" }}>comment "Shipped 🚀"</span>
                        </p>
                        <p className="text-[12px]">
                            <span style={{ color: "#7C6FE0" }}>on:</span>{" "}
                            <span style={{ color: "#6E7286" }}>check.failed</span>{" "}
                            <span style={{ color: "#4C5164" }}>→</span>{" "}
                            <span style={{ color: "#E3A857" }}>notify #alerts</span>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}