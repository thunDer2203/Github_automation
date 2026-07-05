"use client";

export default function Home() {
    const login = () => {
        window.location.href = `${process.env.BACKEND_URL}/auth/github`;
    };

    return (
        <main className="min-h-screen bg-[#14161F] text-white flex items-center justify-center px-6 relative overflow-hidden">
            {/* ambient grid backdrop */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="relative w-full max-w-sm text-center">
                <div className="w-11 h-11 rounded-xl bg-[#5B5FEF] flex items-center justify-center mx-auto mb-6">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinejoin="round" strokeLinecap="round" />
                    </svg>
                </div>

                <h1 className="font-['Space_Grotesk'] text-3xl font-semibold tracking-tight">
                    Automate GitHub Workflows
                </h1>

                <p className="text-[#9497AB] mt-2 text-[15px] leading-relaxed">
                    Turn GitHub events into automatic labels, comments, and Slack alerts — no code required.
                </p>

                {/* signature: trigger -> action pipeline */}
                <div className="flex items-center justify-center gap-2 mt-8 mb-9 font-['JetBrains_Mono'] text-[11px] text-[#8B8EFB] flex-wrap">
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                        issue.opened
                    </span>
                    <span className="text-[#5F6274]">→</span>
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                        add label
                    </span>
                    <span className="text-[#5F6274]">→</span>
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                        notify Slack
                    </span>
                </div>

                <button
                    onClick={login}
                    className="w-full inline-flex items-center justify-center gap-2.5 rounded-lg cursor-pointer bg-white text-[#14161F] px-6 py-3 text-sm font-medium hover:bg-[#E4E4EA] transition-colors"
                >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                        <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55v-2.17c-3.2.7-3.88-1.35-3.88-1.35-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.74.4-1.26.72-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.39-5.25 5.67.42.36.78 1.07.78 2.17v3.22c0 .3.21.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
                    </svg>
                    Continue with GitHub
                </button>

                <p className="text-[#5F6274] text-xs mt-6">
                    We only request read access to repositories you choose to connect.
                </p>
            </div>
        </main>
    );
}