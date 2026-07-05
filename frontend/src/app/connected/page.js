"use client";

import { useEffect, useState } from "react";
import RepositoryCard from "./components/RepositoryCard";

export default function ConnectedRepositoriesPage() {
    const [repos, setRepos] = useState([]);

    useEffect(() => {
        fetchRepositories();
    }, []);

    async function fetchRepositories() {
        const res = await fetch("http://localhost:5000/repos", {
            credentials: "include",
        });

        const data = await res.json();
        setRepos(data);
    }

    async function disconnectRepository(id) {
        const res = await fetch(`http://localhost:5000/repos/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (res.ok) {
            fetchRepositories();
        }
    }

    return (
        <main className="min-h-screen bg-gray-100 p-10">
            <h1 className="text-4xl font-bold mb-8">
                Connected Repositories
            </h1>

            {repos.length === 0 && (
                <h2>No repositories connected.</h2>
            )}

            <div className="space-y-6">
                {repos.map((repo) => (
                    <RepositoryCard
                        key={repo.id}
                        repo={repo}
                        onDisconnect={disconnectRepository}
                    />
                ))}
            </div>
        </main>
    );
}