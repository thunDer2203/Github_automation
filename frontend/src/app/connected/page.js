"use client";

import { useEffect, useState } from "react";
import RepositoryCard from "./components/RepositoryCard";
import useAuth from "../hooks/useAuth";
import AppShell from "../components/AppShell";

export default function ConnectedRepositoriesPage() {
    useAuth();
    const [repos, setRepos] = useState([]);

    useEffect(() => {
        fetchRepositories();
    }, []);

    async function fetchRepositories() {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/repos`, {
            credentials: "include",
        });

        const data = await res.json();
        setRepos(Array.isArray(data) ? data : []);
    }

    async function disconnectRepository(id) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/repos/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (res.ok) {
            fetchRepositories();
        }
    }

    return (
        <AppShell
            title="Connected"
            description="Manage automation rules for each connected repository."
        >
            {repos.length === 0 ? (
                <div className="text-center py-20 text-[#6B6F80] bg-white rounded-xl border border-dashed border-[#E4E4EA]">
                    No repositories connected yet — head to Repositories to add one.
                </div>
            ) : (
                <div className="space-y-5">
                    {repos.map((repo) => (
                        <RepositoryCard
                            key={repo.id}
                            repo={repo}
                            onDisconnect={disconnectRepository}
                        />
                    ))}
                </div>
            )}
        </AppShell>
    );
}