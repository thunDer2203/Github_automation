"use client";

import { useState } from "react";

export default function RuleForm({
    repositoryId,
    rule,
    onSuccess,
    onCancel,
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
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rules/${rule.id}`, {
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
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/rules/${repositoryId}`,
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
        <div
            className="rounded-xl p-5 mb-5"
            style={{ border: "1px solid #262B3A", backgroundColor: "#0E1016" }}
        >
            <style>{`
                .dt-field {
                    width: 100%;
                    background-color: #12141C;
                    border: 1px solid #262B3A;
                    color: #ECEDF3;
                    border-radius: 0.5rem;
                    padding: 0.6rem 0.85rem;
                    font-size: 0.875rem;
                    outline: none;
                    transition: border-color .15s, box-shadow .15s;
                }
                .dt-field::placeholder { color: #4C5164; }
                .dt-field:focus { border-color: #7C6FE0; box-shadow: 0 0 0 2px rgba(124,111,224,0.25); }
                .dt-field option { background-color: #12141C; color: #ECEDF3; }
            `}</style>

            <div className="space-y-4 mb-6">
                <Field label="Rule name">
                    <input
                        className="dt-field"
                        placeholder="e.g. Label incoming bugs"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                    />
                </Field>

                <Field label="Trigger">
                    <select
                        className="dt-field"
                        value={trigger}
                        onChange={(e) =>
                            setTrigger(e.target.value)
                        }
                    >
                        <option value="ISSUE_OPENED">
                            Issue opened
                        </option>

                        <option value="PR_OPENED">
                            Pull request opened
                        </option>

                        <option value="PUSH">
                            Push
                        </option>
                    </select>
                </Field>
            </div>

            <SectionHeader
                label="Conditions"
                hint="All conditions must match for this rule to run."
                action={
                    <AddButton onClick={addCondition} label="+ Add condition" />
                }
            />

            <div className="mb-3">
                {conditions.map((condition, index) => (
                    <div key={index}>
                        {index > 0 && (
                            <div className="flex items-center gap-2 py-2">
                                <span
                                    className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded"
                                    style={{ color: "#4C5164", backgroundColor: "rgba(255,255,255,0.04)" }}
                                >
                                    and
                                </span>
                                <div className="flex-1" style={{ borderTop: "1px solid #1A1D28" }} />
                            </div>
                        )}

                        <div
                            className="rounded-lg p-3.5"
                            style={{ backgroundColor: "#12141C", border: "1px solid #262B3A" }}
                        >
                            <div className="flex gap-2 mb-2 flex-wrap">
                                <select
                                    value={condition.field}
                                    onChange={(e) =>
                                        updateCondition(
                                            index,
                                            "field",
                                            e.target.value
                                        )
                                    }
                                    className="dt-field"
                                    style={{ width: "auto" }}
                                >
                                    <option value="TITLE">Title</option>
                                    <option value="BODY">Body</option>
                                    <option value="AUTHOR">Author</option>
                                    <option value="LABEL">Label</option>
                                </select>

                                <select
                                    value={condition.operator}
                                    onChange={(e) =>
                                        updateCondition(
                                            index,
                                            "operator",
                                            e.target.value
                                        )
                                    }
                                    className="dt-field"
                                    style={{ width: "auto" }}
                                >
                                    <option value="CONTAINS">Contains</option>
                                    <option value="EQUALS">Equals</option>
                                    <option value="STARTS_WITH">Starts with</option>
                                    <option value="ENDS_WITH">Ends with</option>
                                </select>
                            </div>

                            <input
                                className="dt-field mb-2"
                                placeholder="Value to match"
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
                                onClick={() => removeCondition(index)}
                                className="text-sm font-medium hover:underline cursor-pointer"
                                style={{ color: "#E0616B" }}
                            >
                                Remove condition
                            </button>
                        </div>
                    </div>
                ))}

                {conditions.length === 0 && (
                    <p className="text-sm py-2" style={{ color: "#4C5164" }}>
                        No conditions — this rule runs on every trigger match.
                    </p>
                )}
            </div>

            <SectionHeader
                label="Actions"
                hint="What Hookline should do when the trigger and conditions match."
                action={
                    <AddButton onClick={addAction} label="+ Add action" />
                }
            />

            <div className="space-y-3 mb-6">
                {actions.map((action, index) => (
                    <div
                        key={index}
                        className="rounded-lg p-3.5"
                        style={{ backgroundColor: "#12141C", border: "1px solid #262B3A" }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span
                                className="text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0"
                                style={{ color: "#6E7286", fontFamily: "'JetBrains Mono', monospace" }}
                            >
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <select
                                value={action.type}
                                onChange={(e) =>
                                    updateAction(
                                        index,
                                        "type",
                                        e.target.value
                                    )
                                }
                                className="dt-field"
                            >
                                <option value="ADD_LABEL">Add label</option>
                                <option value="COMMENT">Comment</option>
                                <option value="SLACK">Slack</option>
                            </select>
                        </div>

                        <input
                            className="dt-field mb-2"
                            placeholder="Action value"
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
                            onClick={() => removeAction(index)}
                            className="text-sm font-medium hover:underline cursor-pointer"
                            style={{ color: "#E0616B" }}
                        >
                            Remove action
                        </button>
                    </div>
                ))}

                {actions.length === 0 && (
                    <p className="text-sm py-2" style={{ color: "#4C5164" }}>
                        No actions yet — add at least one so this rule does something.
                    </p>
                )}
            </div>

            <div className="flex items-center gap-3 pt-1" style={{ borderTop: "1px solid #1A1D28" }}>
                <button
                    onClick={onCancel}
                    className="text-sm font-medium px-4 py-2 rounded-lg cursor-pointer transition-colors mt-4"
                    style={{ color: "#9497AB" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#ECEDF3")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#9497AB")}
                >
                    Cancel
                </button>

                <button
                    onClick={submit}
                    className="text-sm font-medium px-4 py-2 rounded-lg ml-auto cursor-pointer transition-colors mt-4"
                    style={{ backgroundColor: "#ECEDF3", color: "#0A0C12" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#D5D7E0")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ECEDF3")}
                >
                    Save rule
                </button>
            </div>
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div>
            <label
                className="block text-[11px] uppercase tracking-wide font-medium mb-1.5"
                style={{ color: "#6E7286" }}
            >
                {label}
            </label>
            {children}
        </div>
    );
}

function SectionHeader({ label, hint, action }) {
    return (
        <div className="flex items-start justify-between gap-3 mb-3">
            <div>
                <h3 className="text-sm font-semibold" style={{ color: "#ECEDF3" }}>
                    {label}
                </h3>
                <p className="text-[13px] mt-0.5" style={{ color: "#6E7286" }}>{hint}</p>
            </div>
            {action}
        </div>
    );
}

function AddButton({ onClick, label }) {
    return (
        <button
            onClick={onClick}
            className="shrink-0 text-sm font-medium px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
            style={{ color: "#8B80EF", border: "1px solid rgba(124,111,224,0.35)" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(124,111,224,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
            {label}
        </button>
    );
}