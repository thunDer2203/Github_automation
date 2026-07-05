"use client";

import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import AppShell from "../components/AppShell";

const EVENT_TYPES = [
    "",
    "REPOSITORY_CONNECTED",
    "REPOSITORY_DISCONNECTED",
    "JOB_SUCCESS",
    "JOB_RETRY",
    "JOB_FAILED",
    "RULE_CREATED",
    "RULE_UPDATED",
    "RULE_DELETED",
    "LABEL_ADDED",
    "COMMENT_ADDED",
    "SLACK_SENT",
    "ACTION_SUCCESS",
    "ACTION_FAILED",
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
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/stats`,
            {
                credentials: "include",
            }
        );

        const data = await res.json();
        setStats(data);
    }

    async function fetchRepositories() {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/repos`,
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
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard?${params.toString()}`,
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
            <style>{`
                .dash-select {
                    background-color: #12141C;
                    border: 1px solid #262B3A;
                    color: #ECEDF3;
                }
                .dash-select:focus {
                    outline: none;
                    border-color: #7C6FE0;
                    box-shadow: 0 0 0 2px rgba(124,111,224,0.25);
                }
                .dash-select option {
                    background-color: #12141C;
                    color: #ECEDF3;
                }
                .dash-row:hover {
                    background-color: rgba(255,255,255,0.025);
                }
                .truncate-cell {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            `}</style>

            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    {statCards.map((card) => (
                        <StatCard key={card.title} {...card} />
                    ))}
                </div>
            )}

            <div
                className="rounded-xl p-4 mb-6 flex flex-wrap gap-3"
                style={{ backgroundColor: "#12141C", border: "1px solid #262B3A" }}
            >
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

            <div
                className="rounded-xl overflow-hidden overflow-x-auto"
                style={{ backgroundColor: "#12141C", border: "1px solid #262B3A" }}
            >
                <table className="w-full text-sm">
                    <colgroup>
                        <col className="w-[38%]" />
                        <col className="w-[22%]" />
                        <col className="w-[18%]" />
                        <col className="w-[22%]" />
                    </colgroup>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #262B3A" }} className="text-left">
                            <th
                                className="px-5 py-3 font-medium whitespace-nowrap"
                                style={{ color: "#6E7286", fontFamily: "'Inter', sans-serif" }}
                            >
                                Event
                            </th>
                            <th
                                className="px-5 py-3 font-medium whitespace-nowrap"
                                style={{ color: "#6E7286", fontFamily: "'Inter', sans-serif" }}
                            >
                                Repository
                            </th>
                            <th
                                className="px-5 py-3 font-medium whitespace-nowrap"
                                style={{ color: "#6E7286", fontFamily: "'Inter', sans-serif" }}
                            >
                                Status
                            </th>
                            <th
                                className="px-5 py-3 font-medium whitespace-nowrap"
                                style={{ color: "#6E7286", fontFamily: "'Inter', sans-serif" }}
                            >
                                Time
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {events.map((event) => (
                            <tr
                                key={event.id}
                                className="dash-row transition-colors"
                                style={{ borderBottom: "1px solid #1A1D28" }}
                            >
                                <td className="px-5 py-4 max-w-0">
                                    <div
                                        className="truncate-cell font-medium"
                                        style={{ color: "#ECEDF3", fontFamily: "'Inter', sans-serif" }}
                                        title={event.title}
                                    >
                                        {event.title}
                                    </div>
                                    <div
                                        className="truncate-cell text-[13px] mt-0.5"
                                        style={{ color: "#6E7286", fontFamily: "'Inter', sans-serif" }}
                                        title={event.description}
                                    >
                                        {event.description}
                                    </div>
                                </td>

                                <td className="px-5 py-4 max-w-0">
                                    <div
                                        className="truncate-cell text-[13px]"
                                        style={{ color: "#9497AB", fontFamily: "'JetBrains Mono', monospace" }}
                                        title={event.repository?.fullName ?? "—"}
                                    >
                                        {event.repository?.fullName ?? "—"}
                                    </div>
                                </td>

                                <td className="px-5 py-4 whitespace-nowrap">
                                    <span
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                                        style={{
                                            backgroundColor: event.success
                                                ? "rgba(95,191,143,0.12)"
                                                : "rgba(224,97,107,0.12)",
                                            color: event.success ? "#5FBF8F" : "#E0616B",
                                        }}
                                    >
                                        <span
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{ backgroundColor: event.success ? "#5FBF8F" : "#E0616B" }}
                                        />
                                        {event.success ? "Success" : "Failed"}
                                    </span>
                                </td>

                                <td
                                    className="px-5 py-4 whitespace-nowrap text-[13px]"
                                    style={{ color: "#6E7286", fontFamily: "'JetBrains Mono', monospace" }}
                                >
                                    {new Date(event.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}

                        {events.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="text-center px-5 py-16"
                                    style={{ color: "#6E7286", fontFamily: "'Inter', sans-serif" }}
                                >
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
        <div className="rounded-xl p-5" style={{ backgroundColor: "#12141C", border: "1px solid #262B3A" }}>
            <div className="flex items-center justify-between mb-3">
                <p className="text-[13px]" style={{ color: "#6E7286", fontFamily: "'Inter', sans-serif" }}>
                    {title}
                </p>
                <StatIcon name={icon} />
            </div>
            <h2
                className="text-[28px] font-semibold leading-none"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#ECEDF3" }}
            >
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
            stroke="#7C6FE0"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
        >
            {icons[name]}
        </svg>
    );
}

function Select({ value, onChange, defaultLabel, options }) {
    return (
        <select
            className="dash-select rounded-lg px-3 py-2 text-sm"
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