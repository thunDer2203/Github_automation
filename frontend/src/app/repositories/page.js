"use client";

import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import AppShell from "../components/AppShell";

export default function RepositoriesPage() {
    useAuth();
    const [repos, setRepos] = useState([]);
    const [connectedRepos, setConnectedRepos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [githubRes, connectedRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/github/repos`, {
                    credentials: "include",
                }),
                fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/repos`, {
                    credentials: "include",
                }),
            ]);

            const githubRepos = await githubRes.json();
            const connected = await connectedRes.json();

            setRepos(
                Array.isArray(githubRepos) ? githubRepos : []
            );

            setConnectedRepos(
                Array.isArray(connected) ? connected : []
            );
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function connectRepository(repo) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/repos`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(repo),
            });
            const data = await res.json();

            if (res.ok) {
                loadData();
            }
            if (res.status === 400 && data.message === "Repository already connected") {
                // Refresh the UI so the button changes to "Connected"
                loadData();
                return;
            }
        } catch (err) {
            console.log(err);
        }
    }

    function isConnected(repoId) {
        return connectedRepos.some(
            (repo) => (repo.githubRepoId) === String(repoId)
        );
    }

    return (
        <AppShell
            title="Repositories"
            description="Choose which GitHub repositories Hookline should watch."
        >
            {loading ? (
                <RepoListSkeleton />
            ) : (
                <div className="grid gap-3">
                    {repos.map((repo) => (
                        <div
                            key={repo.id}
                            className="rounded-xl p-5 flex items-center justify-between gap-4 transition-colors"
                            style={{ backgroundColor: "#12141C", border: "1px solid #262B3A" }}
                        >
                            <div className="min-w-0">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <h2
                                        className="text-[15px] font-semibold truncate"
                                        style={{ color: "#ECEDF3", fontFamily: "'Space Grotesk', sans-serif" }}
                                    >
                                        {repo.name}
                                    </h2>
                                    <span
                                        className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-medium"
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
                                    className="text-[13px] mt-1 truncate"
                                    style={{ color: "#6E7286", fontFamily: "'JetBrains Mono', monospace" }}
                                >
                                    {repo.fullName}
                                </p>
                            </div>

                            {isConnected(repo.id) ? (
                                <span
                                    className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium"
                                    style={{ color: "#5FBF8F" }}
                                >
                                    <span
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: "#5FBF8F" }}
                                    />
                                    Connected
                                </span>
                            ) : (
                                <button
                                    onClick={() =>
                                        connectRepository({
                                            githubRepoId: String(repo.id),
                                            name: repo.name,
                                            fullName: repo.fullName,
                                            owner: repo.owner,
                                            private: repo.private,
                                            defaultBranch: repo.defaultBranch,
                                        })
                                    }
                                    className="shrink-0 cursor-pointer text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                                    style={{ backgroundColor: "#ECEDF3", color: "#0A0C12" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#D5D7E0")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ECEDF3")}
                                >
                                    Connect
                                </button>
                            )}
                        </div>
                    ))}

                    {repos.length === 0 && (
                        <div
                            className="text-center py-20 rounded-xl"
                            style={{ color: "#6E7286", border: "1px dashed #262B3A" }}
                        >
                            No GitHub repositories found for this account.
                        </div>
                    )}
                </div>
            )}
        </AppShell>
    );
}

function RepoListSkeleton() {
    return (
        <div className="grid gap-3">
            <style>{`
                @keyframes skeletonPulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.9; }
                }
                .skeleton-row {
                    animation: skeletonPulse 1.6s ease-in-out infinite;
                }
            `}</style>
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="skeleton-row rounded-xl h-[76px]"
                    style={{ backgroundColor: "#12141C", border: "1px solid #1A1D28" }}
                />
            ))}
        </div>
    );
}