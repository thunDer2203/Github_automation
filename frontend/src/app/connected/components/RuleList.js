"use client";

import { useEffect, useState } from "react";
import RuleForm from "./RuleForm";

const TRIGGER_LABELS = {
    ISSUE_OPENED: "Issue opened",
    PR_OPENED: "Pull request opened",
    PUSH: "Push",
};

export default function RuleList({ repositoryId }) {
    const [rules, setRules] = useState([]);
    const [editingRule, setEditingRule] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchRules();
    }, []);

    async function fetchRules() {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/rules/${repositoryId}`,
            {
                credentials: "include",
            }
        );

        const data = await res.json();

        setRules(data);
    }

    async function deleteRule(id) {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rules/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        fetchRules();
    }

    function closeForm() {
        setShowForm(false);
        setEditingRule(null);
    }

    const isAdding = showForm && !editingRule;

    return (
        <div className="mt-6 pt-5" style={{ borderTop: "1px solid #1A1D28" }}>
            <div className="flex items-center justify-between mb-4">
                <h3
                    className="text-sm font-semibold uppercase tracking-wide"
                    style={{ color: "#ECEDF3" }}
                >
                    Automation rules
                </h3>

                <button
                    className="text-sm cursor-pointer font-medium px-3.5 py-2 rounded-lg transition-colors"
                    style={{ backgroundColor: "#ECEDF3", color: "#0A0C12" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#D5D7E0")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ECEDF3")}
                    onClick={() => {
                        setEditingRule(null);
                        setShowForm(true);
                    }}
                >
                    + Add rule
                </button>
            </div>

            {isAdding && (
                <RuleForm
                    repositoryId={repositoryId}
                    rule={null}
                    onSuccess={() => {
                        closeForm();
                        fetchRules();
                    }}
                    onCancel={closeForm}
                />
            )}

            {rules.length === 0 && !showForm && (
                <p className="text-sm py-4" style={{ color: "#6E7286" }}>
                    No rules yet — add one to start automating this repository.
                </p>
            )}

            <div className="space-y-3">
                {rules.map((rule) => {
                    if (editingRule && editingRule.id === rule.id) {
                        return (
                            <RuleForm
                                key={rule.id}
                                repositoryId={repositoryId}
                                rule={editingRule}
                                onSuccess={() => {
                                    closeForm();
                                    fetchRules();
                                }}
                                onCancel={closeForm}
                            />
                        );
                    }

                    return (
                        <div
                            key={rule.id}
                            className="rounded-lg p-4"
                            style={{ border: "1px solid #262B3A" }}
                        >
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div className="min-w-0">
                                    <h4 className="font-medium" style={{ color: "#ECEDF3" }}>
                                        {rule.name}
                                    </h4>

                                    {/* trigger -> action pipeline */}
                                    <div
                                        className="flex items-center gap-1.5 mt-2.5 flex-wrap text-[11px]"
                                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                    >
                                        <span
                                            className="px-2 py-1 rounded-md font-medium"
                                            style={{ backgroundColor: "rgba(124,111,224,0.14)", color: "#8B80EF" }}
                                        >
                                            {TRIGGER_LABELS[rule.trigger] ?? rule.trigger}
                                        </span>

                                        {rule.actions.map((action) => (
                                            <span key={action.id} className="flex items-center gap-1.5">
                                                <span style={{ color: "#4C5164" }}>→</span>
                                                <span
                                                    className="px-2 py-1 rounded-md"
                                                    style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "#9497AB" }}
                                                >
                                                    {action.type.replaceAll("_", " ").toLowerCase()}
                                                    {action.value ? `: ${action.value}` : ""}
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="shrink-0 flex items-center gap-2">
                                    <button
                                        className="text-sm font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                                        style={{ color: "#9497AB", border: "1px solid #262B3A" }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
                                            e.currentTarget.style.color = "#ECEDF3";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = "transparent";
                                            e.currentTarget.style.color = "#9497AB";
                                        }}
                                        onClick={() => {
                                            setEditingRule(rule);
                                            setShowForm(true);
                                        }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                        style={{ color: "#E0616B", border: "1px solid rgba(224,97,107,0.35)" }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(224,97,107,0.1)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                                        onClick={() => deleteRule(rule.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}