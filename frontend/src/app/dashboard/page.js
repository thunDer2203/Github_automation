"use client";

import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import AppShell from "../components/AppShell";

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

    const statCards = stats
        ? [
              { title: "Events", value: stats.totalEvents, icon: "activity" },
              { title: "Repositories", value: stats.connectedRepositories, icon: "repo" },
              { title: "Labels", value: stats.labelsAdded, icon: "tag" },
              { title: "Comments", value: stats.commentsAdded, icon: "comment" },
              { title: "Slack", value: stats.slackNotifications, icon: "slack" },
          ]
        : [];

    return (
        <AppShell
            title="Dashboard"
            description="A live feed of everything your automations have done."
        >
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    {statCards.map((card) => (
                        <StatCard key={card.title} {...card} />
                    ))}
                </div>
            )}

            <div className="bg-white rounded-xl border border-[#E4E4EA] p-4 mb-6 flex flex-wrap gap-3">
                <Select
                    value={repositoryId}
                    onChange={setRepositoryId}
                    defaultLabel="All repositories"
                    options={repositories.map((repo) => ({
                        value: repo.id,
                        label: repo.fullName,
                    }))}
                />

                <Select
                    value={type}
                    onChange={setType}
                    defaultLabel="All events"
                    options={EVENT_TYPES.slice(1).map((event) => ({
                        value: event,
                        label: event.replaceAll("_", " "),
                    }))}
                />

                <Select
                    value={success}
                    onChange={setSuccess}
                    defaultLabel="All status"
                    options={[
                        { value: "true", label: "Success" },
                        { value: "false", label: "Failed" },
                    ]}
                />
            </div>

            <div className="bg-white rounded-xl border border-[#E4E4EA] overflow-hidden overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[#E4E4EA] text-left text-[#6B6F80]">
                            <th className="px-5 py-3 font-medium whitespace-nowrap">Event</th>
                            <th className="px-5 py-3 font-medium whitespace-nowrap">Repository</th>
                            <th className="px-5 py-3 font-medium whitespace-nowrap">Status</th>
                            <th className="px-5 py-3 font-medium whitespace-nowrap">Time</th>
                        </tr>
                    </thead>

                    <tbody>
                        {events.map((event) => (
                            <tr
                                key={event.id}
                                className="border-b border-[#EDEDF1] last:border-0 hover:bg-[#FAFAFB] transition-colors"
                            >
                                <td className="px-5 py-4">
                                    <div className="font-medium text-[#1B1D29]">{event.title}</div>
                                    <div className="text-[#6B6F80] text-[13px] mt-0.5">
                                        {event.description}
                                    </div>
                                </td>

                                <td className="px-5 py-4 font-['JetBrains_Mono'] text-[13px] text-[#4B4E5E] whitespace-nowrap">
                                    {event.repository?.fullName ?? "—"}
                                </td>

                                <td className="px-5 py-4 whitespace-nowrap">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                            event.success
                                                ? "bg-[#E8F7EF] text-[#1F9D6D]"
                                                : "bg-[#FDEBEC] text-[#E5484D]"
                                        }`}
                                    >
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full ${
                                                event.success ? "bg-[#1F9D6D]" : "bg-[#E5484D]"
                                            }`}
                                        />
                                        {event.success ? "Success" : "Failed"}
                                    </span>
                                </td>

                                <td className="px-5 py-4 text-[#6B6F80] whitespace-nowrap">
                                    {new Date(event.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}

                        {events.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center px-5 py-16 text-[#6B6F80]">
                                    No events match these filters yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AppShell>
    );
}

function StatCard({ title, value, icon }) {
    return (
        <div className="bg-white rounded-xl border border-[#E4E4EA] p-5">
            <div className="flex items-center justify-between mb-3">
                <p className="text-[#6B6F80] text-[13px]">{title}</p>
                <StatIcon name={icon} />
            </div>
            <h2 className="font-['Space_Grotesk'] text-[28px] font-semibold text-[#1B1D29] leading-none">
                {value ?? 0}
            </h2>
        </div>
    );
}

function StatIcon({ name }) {
    const icons = {
        activity: <path d="M3 12h4l3 8 4-16 3 8h4" />,
        repo: <path d="M4 4h13a2 2 0 0 1 2 2v14l-8.5-4L4 20V4Z" />,
        tag: <path d="M3 11.5 11.5 3H19a2 2 0 0 1 2 2v7.5L12.5 21 3 11.5Z" />,
        comment: <path d="M4 4h16v12H8l-4 4V4Z" />,
        slack: <path d="M9 3v9M15 3v6M6 12h6m3 3H9m9-3v9" />,
    };

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-[#8B8EFB]"
        >
            {icons[name]}
        </svg>
    );
}

function Select({ value, onChange, defaultLabel, options }) {
    return (
        <select
            className="border border-[#E4E4EA] rounded-lg px-3 py-2 text-sm text-[#1B1D29] bg-white focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]/30 focus:border-[#5B5FEF]"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">{defaultLabel}</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}