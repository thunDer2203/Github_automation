"use client";

import { useEffect, useState } from "react";
import RuleForm from "./RuleForm";

const API = "http://localhost:5000";

export default function RuleList({ repositoryId }) {
    const [rules, setRules] = useState([]);

    const [editingRule, setEditingRule] = useState(null);

    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchRules();
    }, []);

    async function fetchRules() {
        const res = await fetch(
            `${API}/rules/${repositoryId}`,
            {
                credentials: "include",
            }
        );

        const data = await res.json();

        setRules(data);
    }

    async function deleteRule(id) {
        await fetch(`${API}/rules/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        fetchRules();
    }

    return (
        <div className="mt-8 border-t pt-6">

            <div className="flex justify-between mb-4">

                <h3 className="text-xl font-bold">
                    Automation Rules
                </h3>

                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => {
                        setEditingRule(null);
                        setShowForm(true);
                    }}
                >
                    Add Rule
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

            {rules.map((rule) => (
                <div
                    key={rule.id}
                    className="border rounded-lg p-4 mt-4"
                >
                    <div className="flex justify-between">

                        <div>

                            <h4 className="font-semibold">
                                {rule.name}
                            </h4>

                            <p>{rule.trigger}</p>

                            <div className="mt-3">

                                {rule.actions.map((action) => (
                                    <div key={action.id}>
                                        {action.type} : {action.value}
                                    </div>
                                ))}

                            </div>

                        </div>

                        <div className="space-x-2">

                            <button
                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                                onClick={() => {
                                    setEditingRule(rule);
                                    setShowForm(true);
                                }}
                            >
                                Edit
                            </button>

                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded"
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
    );
}