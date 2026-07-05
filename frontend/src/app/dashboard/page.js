"use client";

import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

const EVENT_TYPES = [
    "",
    "REPOSITORY_CONNECTED",
    "REPOSITORY_DISCONNECTED",
    "RULE_CREATED",
    "RULE_UPDATED",
    "RULE_DELETED",
    "LABEL_ADDED",
    "COMMENT_ADDED",
    "SLACK_SENT",
];

export default function DashboardPage() {
  useAuth();
    const [stats, setStats] = useState(null);
    const [events, setEvents] = useState([]);
    const [repositories, setRepositories] = useState([]);

    const [repositoryId, setRepositoryId] = useState("");
    const [type, setType] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchStats();
        fetchRepositories();
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [repositoryId, type, success]);

    async function fetchStats() {
        const res = await fetch(
            "http://localhost:5000/dashboard/stats",
            {
                credentials: "include",
            }
        );

        const data = await res.json();
        setStats(data);
    }

    async function fetchRepositories() {
        const res = await fetch(
            "http://localhost:5000/repos",
            {
                credentials: "include",
            }
        );

        const data = await res.json();
        setRepositories(
            Array.isArray(data) ? data : []
        );
    }

    async function fetchDashboard() {
        const params = new URLSearchParams();

        if (repositoryId) params.append("repositoryId", repositoryId);
        if (type) params.append("type", type);
        if (success) params.append("success", success);

        const res = await fetch(
            `http://localhost:5000/dashboard?${params.toString()}`,
            {
                credentials: "include",
            }
        );

        const data = await res.json();

        setEvents(Array.isArray(data) ? data : []);
    }

    return (
        <main className="min-h-screen bg-gray-100 p-10">
            <h1 className="text-4xl font-bold mb-8">
                Dashboard
            </h1>

            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-10">
                    <StatCard
                        title="Events"
                        value={stats.totalEvents}
                    />

                    <StatCard
                        title="Repositories"
                        value={stats.connectedRepositories}
                    />

                    <StatCard
                        title="Labels"
                        value={stats.labelsAdded}
                    />

                    <StatCard
                        title="Comments"
                        value={stats.commentsAdded}
                    />

                    <StatCard
                        title="Slack"
                        value={stats.slackNotifications}
                    />
                </div>
            )}

            <div className="bg-white rounded-xl shadow p-5 mb-8 flex flex-wrap gap-4">

                <select
                    className="border rounded p-2"
                    value={repositoryId}
                    onChange={(e) =>
                        setRepositoryId(e.target.value)
                    }
                >
                    <option value="">
                        All Repositories
                    </option>

                    {repositories.map((repo) => (
                        <option
                            key={repo.id}
                            value={repo.id}
                        >
                            {repo.fullName}
                        </option>
                    ))}
                </select>

                <select
                    className="border rounded p-2"
                    value={type}
                    onChange={(e) =>
                        setType(e.target.value)
                    }
                >
                    <option value="">
                        All Events
                    </option>

                    {EVENT_TYPES.slice(1).map((event) => (
                        <option
                            key={event}
                            value={event}
                        >
                            {event.replaceAll("_", " ")}
                        </option>
                    ))}
                </select>

                <select
                    className="border rounded p-2"
                    value={success}
                    onChange={(e) =>
                        setSuccess(e.target.value)
                    }
                >
                    <option value="">
                        All Status
                    </option>

                    <option value="true">
                        Success
                    </option>

                    <option value="false">
                        Failed
                    </option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="text-left p-4">
                                Event
                            </th>

                            <th className="text-left p-4">
                                Repository
                            </th>

                            <th className="text-left p-4">
                                Status
                            </th>

                            <th className="text-left p-4">
                                Time
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {events.map((event) => (
                            <tr
                                key={event.id}
                                className="border-t"
                            >
                                <td className="p-4">
                                    <div className="font-semibold">
                                        {event.title}
                                    </div>

                                    <div className="text-gray-500 text-sm">
                                        {event.description}
                                    </div>
                                </td>

                                <td className="p-4">
                                    {event.repository
                                        ?.fullName ??
                                        "-"}
                                </td>

                                <td className="p-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            event.success
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {event.success
                                            ? "Success"
                                            : "Failed"}
                                    </span>
                                </td>

                                <td className="p-4">
                                    {new Date(
                                        event.createdAt
                                    ).toLocaleString()}
                                </td>
                            </tr>
                        ))}

                        {events.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="text-center p-10 text-gray-500"
                                >
                                    No events found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
                {title}
            </p>

            <h2 className="text-3xl font-bold mt-2">
                {value}
            </h2>
        </div>
    );
}