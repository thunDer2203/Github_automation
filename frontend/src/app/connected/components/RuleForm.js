"use client";

import { useState } from "react";



const inputClass =
    "w-full border border-[#E4E4EA] rounded-lg px-3.5 py-2.5 text-sm text-[#1B1D29] focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]/30 focus:border-[#5B5FEF]";

const selectClass =
    "border border-[#E4E4EA] rounded-lg px-3.5 py-2.5 text-sm text-[#1B1D29] bg-white focus:outline-none focus:ring-2 focus:ring-[#5B5FEF]/30 focus:border-[#5B5FEF]";

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
            await fetch(`${NEXT_PUBLIC_BACKEND_URL}/rules/${rule.id}`, {
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
                `${NEXT_PUBLIC_BACKEND_URL}/rules/${repositoryId}`,
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
        <div className="border border-[#E4E4EA] rounded-xl p-5 mb-5 bg-[#FAFAFB]">

            <div className="space-y-4 mb-6">
                <Field label="Rule name">
                    <input
                        className={inputClass}
                        placeholder="e.g. Label incoming bugs"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                    />
                </Field>

                <Field label="Trigger">
                    <select
                        className={`${selectClass} w-full`}
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
            />

            <div className="space-y-3 mb-3">
                {conditions.map((condition, index) => (
                    <div
                        key={index}
                        className="bg-white border border-[#E4E4EA] rounded-lg p-3.5"
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
                                className={selectClass}
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
                                className={selectClass}
                            >
                                <option value="CONTAINS">
                                    Contains
                                </option>

                                <option value="EQUALS">
                                    Equals
                                </option>

                                <option value="STARTS_WITH">
                                    Starts with
                                </option>

                                <option value="ENDS_WITH">
                                    Ends with
                                </option>
                            </select>

                        </div>

                        <input
                            className={`${inputClass} mb-2`}
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
                            onClick={() =>
                                removeCondition(index)
                            }
                            className="text-[#E5484D] text-sm font-medium hover:underline cursor-pointer"
                        >
                            Remove condition
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={addCondition}
                className="text-sm font-medium text-[#4B4E5E] border border-[#E4E4EA] px-3.5 py-2 rounded-lg hover:bg-white transition-colors mb-7 cursor-pointer"
            >
                + Add condition
            </button>

            <SectionHeader
                label="Actions"
                hint="What Hookline should do when the trigger and conditions match."
            />

            <div className="space-y-3 mb-3">
                {actions.map((action, index) => (
                    <div
                        key={index}
                        className="bg-white border border-[#E4E4EA] rounded-lg p-3.5"
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
                            className={`${selectClass} w-full`}
                        >
                            <option value="ADD_LABEL">
                                Add label
                            </option>

                            <option value="COMMENT">
                                Comment
                            </option>

                            <option value="SLACK">
                                Slack
                            </option>
                        </select>

                        <input
                            className={`${inputClass} mt-2 mb-2`}
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
                            onClick={() =>
                                removeAction(index)
                            }
                            className="text-[#E5484D] text-sm font-medium hover:underline cursor-pointer"
                        >
                            Remove action
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-3 pt-1">
                <button
                    onClick={addAction}
                    className="text-sm font-medium text-[#4B4E5E] border border-[#E4E4EA] px-3.5 py-2 rounded-lg hover:bg-white transition-colors cursor-pointer"
                >
                    + Add action
                </button>

                <button
                    onClick={submit}
                    className="bg-[#14161F] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1F2230] transition-colors ml-auto cursor-pointer"
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
            <label className="block text-[11px] uppercase tracking-wide font-medium text-[#6B6F80] mb-1.5">
                {label}
            </label>
            {children}
        </div>
    );
}

function SectionHeader({ label, hint }) {
    return (
        <div className="mb-3">
            <h3 className="text-sm font-semibold text-[#1B1D29]">
                {label}
            </h3>
            <p className="text-[13px] text-[#6B6F80] mt-0.5">{hint}</p>
        </div>
    );
}