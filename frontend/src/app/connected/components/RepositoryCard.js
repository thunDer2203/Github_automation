"use client";

import RuleList from "./RuleList";

export default function RepositoryCard({
    repo,
    onDisconnect,
}) {
    return (
        <div
            className="rounded-xl p-6"
            style={{ backgroundColor: "#12141C", border: "1px solid #262B3A" }}
        >
            <div className="flex justify-between items-start gap-4 flex-wrap">
                <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-lg font-semibold" style={{ color: "#ECEDF3", fontFamily: "'Space Grotesk', sans-serif" }}>
                            {repo.name}
                        </h2>
                        <span
                            className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                            style={
                                repo.private
                                    ? { backgroundColor: "rgba(227,168,87,0.12)", color: "#E3A857" }
                                    : { backgroundColor: "rgba(124,111,224,0.14)", color: "#8B80EF" }
                            }
                        >
                            {repo.private ? "Private" : "Public"}
                        </span>
                    </div>

                    <p
                        className="text-[13px] mt-1"
                        style={{ color: "#6E7286", fontFamily: "'JetBrains Mono', monospace" }}
                    >
                        {repo.fullName}
                    </p>
                </div>

                <button
                    onClick={() => onDisconnect(repo.id)}
                    className="shrink-0 text-sm font-medium px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                    style={{ color: "#E0616B", border: "1px solid rgba(224,97,107,0.35)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(224,97,107,0.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                    Disconnect
                </button>
            </div>

            <RuleList repositoryId={repo.id} />
        </div>
    );
}