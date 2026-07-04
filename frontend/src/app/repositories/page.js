"use client";

import { useEffect, useState } from "react";

export default function RepositoriesPage() {
    const [repos, setRepos] = useState([]);
    const [connectedRepos, setConnectedRepos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [githubRes, connectedRes] = await Promise.all([
                fetch("http://localhost:5000/github/repos", {
                    credentials: "include",
                }),
                fetch("http://localhost:5000/repos", {
                    credentials: "include",
                }),
            ]);

            const githubRepos = await githubRes.json();
            const connected = await connectedRes.json();

            setRepos(githubRepos);
            setConnectedRepos(connected);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function connectRepository(repo) {
        try{
        const res = await fetch("http://localhost:5000/repos", {
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
    }catch(err){
        console.log(err);
    }
    }

    function isConnected(repoId) {
        return connectedRepos.some(
            (repo) => (repo.githubRepoId) === String(repoId)
        );
    }

    if (loading) return <h1 className="p-10">Loading...</h1>;

    return (
        <main className="min-h-screen bg-gray-100 p-10">
            <h1 className="text-4xl font-bold mb-8">
                Your GitHub Repositories
            </h1>

            <div className="grid gap-5">
                {repos.map((repo) => (
                    <div
                        key={repo.id}
                        className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
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

                        {isConnected(repo.id) ? (
                            <span className="text-green-600 font-semibold">
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
                                        defaultBranch:
                                            repo.defaultBranch,
                                    })
                                }
                                className="bg-black text-white px-5 py-2 rounded-lg"
                            >
                                Connect
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}