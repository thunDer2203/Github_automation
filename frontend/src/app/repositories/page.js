"use client";

import { useEffect, useState } from "react";

export default function RepositoriesPage() {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchRepos() {
            try {
                const res = await fetch(
                    "http://localhost:5000/github/repos",
                    {
                        credentials: "include",
                    }
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch repositories");
                }

                const data = await res.json();
                setRepos(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchRepos();
    }, []);

    if (loading) {
        return (
            <div className="p-10 text-xl">
                Loading repositories...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 p-10">
            <h1 className="text-3xl font-bold mb-8">
                Your GitHub Repositories
            </h1>

            <div className="grid gap-4">
                {repos.map((repo) => (
                    <div
                        key={repo.id}
                        className="rounded-lg bg-white p-5 shadow"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {repo.name}
                                </h2>

                                <p className="text-gray-500">
                                    {repo.fullName}
                                </p>
                            </div>

                            <span
                                className={`rounded-full px-3 py-1 text-sm ${
                                    repo.private
                                        ? "bg-red-100 text-red-600"
                                        : "bg-green-100 text-green-600"
                                }`}
                            >
                                {repo.private ? "Private" : "Public"}
                            </span>
                        </div>

                        <div className="mt-4 text-sm text-gray-600">
                            Default Branch: {repo.defaultBranch}
                        </div>

                        <div className="mt-2 text-sm text-gray-600">
                            Owner: {repo.owner}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}