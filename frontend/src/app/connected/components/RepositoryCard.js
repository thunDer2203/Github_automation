"use client";

import RuleList from "./RuleList";

export default function RepositoryCard({
    repo,
    onDisconnect,
}) {
    return (
        <div className="bg-white rounded-xl border border-[#E4E4EA] p-6">

            <div className="flex justify-between items-start gap-4 flex-wrap">

                <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-lg font-semibold text-[#1B1D29]">
                            {repo.name}
                        </h2>
                        <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                repo.private
                                    ? "bg-[#FFF6E6] text-[#B4790A]"
                                    : "bg-[#EEF0FF] text-[#5B5FEF]"
                            }`}
                        >
                            {repo.private ? "Private" : "Public"}
                        </span>
                    </div>

                    <p className="text-[#6B6F80] text-[13px] font-['JetBrains_Mono'] mt-1">
                        {repo.fullName}
                    </p>
                </div>

                <button
                    onClick={() => onDisconnect(repo.id)}
                    className="shrink-0 text-[#E5484D] text-sm font-medium px-3.5 py-2 rounded-lg border border-[#F5C6C8] hover:bg-[#FDEBEC] transition-colors cursor-pointer"
                >
                    Disconnect
                </button>

            </div>

            <RuleList repositoryId={repo.id} />

        </div>
    );
}