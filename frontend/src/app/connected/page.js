"use client";

import { useEffect, useState } from "react";

export default function ConnectedRepositoriesPage() {
    const [repos, setRepos] = useState([]);

    useEffect(() => {
        fetchRepositories();
    }, []);

    async function fetchRepositories() {
        const res = await fetch(
            "http://localhost:5000/repos",
            {
                credentials: "include",
            }
        );

        const data = await res.json();

        setRepos(data);
    }

    async function disconnectRepository(id) {
        const res = await fetch(
            `http://localhost:5000/repos/${id}`,
            {
                method: "DELETE",
                credentials: "include",
            }
        );

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

            <div className="grid gap-5">
                {repos.map((repo) => (
                    <div
                        key={repo.id}
                        className="bg-white shadow rounded-xl p-6 flex justify-between items-center"
                    >
                        <div>
                            <h2 className="text-xl font-semibold">
                                {repo.name}
                            </h2>

                            <p className="text-gray-500">
                                {repo.fullName}
                            </p>

                            <p className="text-sm mt-2">
                                {repo.private ? "Private" : "Public"}
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                disconnectRepository(repo.id)
                            }
                            className="bg-red-500 text-white px-5 py-2 rounded-lg"
                        >
                            Disconnect
                        </button>
                    </div>
                ))}
            </div>
        </main>
    );
}