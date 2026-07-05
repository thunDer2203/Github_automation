"use client";

import RuleList from "./RuleList";

export default function RepositoryCard({
    repo,
    onDisconnect,
}) {
    return (
        <div className="bg-white rounded-xl shadow p-6">

            <div className="flex justify-between">

                <div>
                    <h2 className="text-2xl font-semibold">
                        {repo.name}
                    </h2>

                    <p className="text-gray-500">
                        {repo.fullName}
                    </p>

                    <p className="mt-2">
                        {repo.private ? "Private" : "Public"}
                    </p>
                </div>

                <button
                    onClick={() => onDisconnect(repo.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Disconnect
                </button>

            </div>

            <RuleList repositoryId={repo.id} />

        </div>
    );
}   