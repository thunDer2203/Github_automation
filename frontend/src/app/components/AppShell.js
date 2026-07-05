"use client";

import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function AppShell({ title, description, actions, children }) {
    return (
        <div className="min-h-screen flex bg-[#F6F6F8]">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="sticky top-0 z-10 bg-[#F6F6F8]/95 backdrop-blur border-b border-[#E4E4EA] px-6 md:px-10 py-5 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                        <h1 className="font-['Space_Grotesk'] text-2xl font-semibold text-[#1B1D29] tracking-tight">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-sm text-[#6B6F80] mt-0.5">{description}</p>
                        )}
                    </div>
                    {actions && <div className="shrink-0 flex items-center gap-3">{actions}</div>}
                </header>

                <main className="flex-1 px-6 md:px-10 py-8">{children}</main>

                <MobileNav />
            </div>
        </div>
    );
}