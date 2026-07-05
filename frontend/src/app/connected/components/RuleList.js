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

    return (
        <div className="mt-6 border-t border-[#EDEDF1] pt-5">

            <div className="flex items-center justify-between mb-4">

                <h3 className="text-sm font-semibold text-[#1B1D29] uppercase tracking-wide">
                    Automation rules
                </h3>

                <button
                    className="bg-[#5B5FEF] text-white text-sm cursor-pointer font-medium px-3.5 py-2 rounded-lg hover:bg-[#4A4EDB] transition-colors"
                    onClick={() => {
                        setEditingRule(null);
                        setShowForm(true);
                    }}
                >
                    Add rule
                </button>

            </div>

            {showForm && (
                <RuleForm
                    repositoryId={repositoryId}
                    rule={editingRule}
                    onSuccess={() => {
                        setShowForm(false);
                        fetchRules();
                    }}
                />
            )}

            {rules.length === 0 && !showForm && (
                <p className="text-[#6B6F80] text-sm py-4">
                    No rules yet — add one to start automating this repository.
                </p>
            )}

            <div className="space-y-3">
                {rules.map((rule) => (
                    <div
                        key={rule.id}
                        className="border border-[#E4E4EA] rounded-lg p-4"
                    >
                        <div className="flex items-start justify-between gap-4 flex-wrap">

                            <div className="min-w-0">
                                <h4 className="font-medium text-[#1B1D29]">
                                    {rule.name}
                                </h4>

                                {/* trigger -> action pipeline */}
                                <div className="flex items-center gap-1.5 mt-2.5 flex-wrap font-['JetBrains_Mono'] text-[11px]">
                                    <span className="px-2 py-1 rounded-md bg-[#EEF0FF] text-[#5B5FEF] font-medium">
                                        {TRIGGER_LABELS[rule.trigger] ?? rule.trigger}
                                    </span>

                                    {rule.actions.map((action) => (
                                        <span key={action.id} className="flex items-center gap-1.5">
                                            <span className="text-[#C7C9D9]">→</span>
                                            <span className="px-2 py-1 rounded-md bg-[#F6F6F8] text-[#4B4E5E]">
                                                {action.type.replaceAll("_", " ").toLowerCase()}
                                                {action.value ? `: ${action.value}` : ""}
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="shrink-0 flex items-center gap-2">

                                <button
                                    className="text-[#4B4E5E] text-sm font-medium px-3 py-1.5 rounded-lg border border-[#E4E4EA] hover:bg-[#F6F6F8] cursor-pointer transition-colors"
                                    onClick={() => {
                                        setEditingRule(rule);
                                        setShowForm(true);
                                    }}
                                >
                                    Edit
                                </button>

                                <button
                                    className="text-[#E5484D] text-sm font-medium px-3 py-1.5 rounded-lg border border-[#F5C6C8] hover:bg-[#FDEBEC] transition-colors cursor-pointer"
                                    onClick={() =>
                                        deleteRule(rule.id)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}