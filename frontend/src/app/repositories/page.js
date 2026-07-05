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
                            className="bg-white rounded-xl border border-[#E4E4EA] p-5 flex items-center justify-between gap-4"
                        >
                            <div className="min-w-0">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <h2 className="text-[15px] font-semibold text-[#1B1D29] truncate">
                                        {repo.name}
                                    </h2>
                                    <span
                                        className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                            repo.private
                                                ? "bg-[#FFF6E6] text-[#B4790A]"
                                                : "bg-[#EEF0FF] text-[#5B5FEF]"
                                        }`}
                                    >
                                        {repo.private ? "Private" : "Public"}
                                    </span>
                                </div>
                                <p className="text-[#6B6F80] text-[13px] font-['JetBrains_Mono'] mt-1 truncate">
                                    {repo.fullName}
                                </p>
                            </div>

                            {isConnected(repo.id) ? (
                                <span className="shrink-0 inline-flex items-center gap-1.5 text-[#1F9D6D] text-sm font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1F9D6D]" />
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
                                    className="shrink-0 bg-[#14161F] cursor-pointer text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1F2230] transition-colors"
                                >
                                    Connect
                                </button>
                            )}
                        </div>
                    ))}

                    {repos.length === 0 && (
                        <div className="text-center py-20 text-[#6B6F80] bg-white rounded-xl border border-dashed border-[#E4E4EA]">
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
            {[...Array(4)].map((_, i) => (
                <div
                    key={i}
                    className="bg-white rounded-xl border border-[#E4E4EA] p-5 h-[76px] animate-pulse"
                />
            ))}
        </div>
    );
}