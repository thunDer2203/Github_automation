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

    const [conditions, setConditions] = useState(
        rule?.conditions || []
    );

    const [actions, setActions] = useState(
        rule?.actions || []
    );

    function addCondition() {
        setConditions([
            ...conditions,
            {
                field: "TITLE",
                operator: "CONTAINS",
                value: "",
            },
        ]);
    }

    function updateCondition(index, field, value) {
        const updated = [...conditions];
        updated[index][field] = value;
        setConditions(updated);
    }

    function removeCondition(index) {
        setConditions(
            conditions.filter((_, i) => i !== index)
        );
    }

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

    function removeAction(index) {
        setActions(
            actions.filter((_, i) => i !== index)
        );
    }

    async function submit() {
        const body = {
            name,
            trigger,
            conditions,
            actions,
        };

        if (rule) {
            await fetch(`${API}/rules/${rule.id}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type":
                        "application/json",
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
                        "Content-Type":
                            "application/json",
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
                className="border p-2 w-full mb-4"
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

            <h3 className="font-semibold mb-3">
                Conditions
            </h3>

            {conditions.map((condition, index) => (
                <div
                    key={index}
                    className="border rounded p-3 mb-3"
                >
                    <div className="flex gap-2 mb-2">

                        <select
                            value={condition.field}
                            onChange={(e) =>
                                updateCondition(
                                    index,
                                    "field",
                                    e.target.value
                                )
                            }
                            className="border p-2"
                        >
                            <option value="TITLE">
                                Title
                            </option>

                            <option value="BODY">
                                Body
                            </option>

                            <option value="AUTHOR">
                                Author
                            </option>

                            <option value="LABEL">
                                Label
                            </option>
                        </select>

                        <select
                            value={
                                condition.operator
                            }
                            onChange={(e) =>
                                updateCondition(
                                    index,
                                    "operator",
                                    e.target.value
                                )
                            }
                            className="border p-2"
                        >
                            <option value="CONTAINS">
                                Contains
                            </option>

                            <option value="EQUALS">
                                Equals
                            </option>

                            <option value="STARTS_WITH">
                                Starts With
                            </option>

                            <option value="ENDS_WITH">
                                Ends With
                            </option>
                        </select>

                    </div>

                    <input
                        className="border p-2 w-full mb-2"
                        placeholder="Condition Value"
                        value={condition.value}
                        onChange={(e) =>
                            updateCondition(
                                index,
                                "value",
                                e.target.value
                            )
                        }
                    />

                    <button
                        onClick={() =>
                            removeCondition(index)
                        }
                        className="text-red-600"
                    >
                        Remove Condition
                    </button>
                </div>
            ))}

            <button
                onClick={addCondition}
                className="bg-gray-700 text-white px-4 py-2 rounded mb-6"
            >
                Add Condition
            </button>

            <h3 className="font-semibold mb-3">
                Actions
            </h3>

            {actions.map((action, index) => (
                <div
                    key={index}
                    className="border rounded p-3 mb-3"
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
                        className="border p-2 w-full"
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
                        className="border p-2 w-full mt-2 mb-2"
                        placeholder="Action Value"
                        value={action.value || ""}
                        onChange={(e) =>
                            updateAction(
                                index,
                                "value",
                                e.target.value
                            )
                        }
                    />

                    <button
                        onClick={() =>
                            removeAction(index)
                        }
                        className="text-red-600"
                    >
                        Remove Action
                    </button>
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