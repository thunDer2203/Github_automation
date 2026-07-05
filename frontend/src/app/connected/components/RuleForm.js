"use client";

import { useState } from "react";

const API = "http://localhost:5000";

export default function RuleForm({
    repositoryId,
    rule,
    onSuccess,
}) {
    const [name, setName] = useState(rule?.name || "");

    const [trigger, setTrigger] = useState(
        rule?.trigger || "ISSUE_OPENED"
    );

    const [actions, setActions] = useState(
        rule?.actions || []
    );

    function addAction() {
        setActions([
            ...actions,
            {
                type: "ADD_LABEL",
                value: "",
            },
        ]);
    }

    function updateAction(index, field, value) {
        const updated = [...actions];

        updated[index][field] = value;

        setActions(updated);
    }

    async function submit() {
        const body = {
            name,
            trigger,
            actions,
        };

        if (rule) {
            await fetch(`${API}/rules/${rule.id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
        } else {
            await fetch(
                `${API}/rules/${repositoryId}`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                }
            );
        }

        onSuccess();
    }

    return (
        <div className="border rounded-lg p-4 mb-4">

            <input
                className="border p-2 w-full mb-3"
                placeholder="Rule Name"
                value={name}
                onChange={(e) =>
                    setName(e.target.value)
                }
            />

            <select
                className="border p-2 w-full mb-3"
                value={trigger}
                onChange={(e) =>
                    setTrigger(e.target.value)
                }
            >
                <option value="ISSUE_OPENED">
                    Issue Opened
                </option>

                <option value="PR_OPENED">
                    Pull Request Opened
                </option>

                <option value="PUSH">
                    Push
                </option>
            </select>

            {actions.map((action, index) => (
                <div
                    key={index}
                    className="border p-3 rounded mb-3"
                >
                    <select
                        value={action.type}
                        onChange={(e) =>
                            updateAction(
                                index,
                                "type",
                                e.target.value
                            )
                        }
                    >
                        <option value="ADD_LABEL">
                            Add Label
                        </option>

                        <option value="COMMENT">
                            Comment
                        </option>

                        <option value="SLACK">
                            Slack
                        </option>
                    </select>

                    <input
                        className="border p-2 w-full mt-2"
                        placeholder="Value"
                        value={action.value}
                        onChange={(e) =>
                            updateAction(
                                index,
                                "value",
                                e.target.value
                            )
                        }
                    />
                </div>
            ))}

            <button
                onClick={addAction}
                className="bg-gray-700 text-white px-4 py-2 rounded mr-3"
            >
                Add Action
            </button>

            <button
                onClick={submit}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Save Rule
            </button>

        </div>
    );
}