import { createIssueLabel, createIssueComment } from "./github.services.js";
import { sendSlackMessage } from "./slack.services.js";
import { addDashboardEvent } from "./dashboard.services.js";
import { generateSlackMessage } from "./ai.service.js";

export async function executeAction({
    action,
    accessToken,
    owner,
    repo,
    issueNumber,
    userId,
    repositoryId,
    payload,
}) {
    try {
        switch (action.type) {
            case "ADD_LABEL":
                await createIssueLabel({
                    accessToken,
                    owner,
                    repo,
                    issueNumber,
                    labels: [action.value],
                });

                await addDashboardEvent({
                    userId,
                    repositoryId,
                    type: "LABEL_ADDED",
                    title: `Added label "${action.value}"`,
                    description: `${owner}/${repo} Issue #${issueNumber}`,
                });
                break;

            case "COMMENT":
                await createIssueComment({
                    accessToken,
                    owner,
                    repo,
                    issueNumber,
                    body: action.value,
                });

                await addDashboardEvent({
                    userId,
                    repositoryId,
                    type: "COMMENT_ADDED",
                    title: "Comment posted",
                    description: `${owner}/${repo} Issue #${issueNumber}`,
                });
                break;

            case "SLACK":
                const aiMessage = await generateSlackMessage(payload);

                await sendSlackMessage({
                    webhookUrl: action.value,
                    message: aiMessage,
                });

                await addDashboardEvent({
                    userId,
                    repositoryId,
                    type: "ACTION_SUCCESS",
                    title: "Slack notification sent",
                    description: aiMessage,
                });
                break;

            default:
                console.log("Unknown action:", action.type);
                return;
        }
    } catch (err) {
        await addDashboardEvent({
            userId,
            repositoryId,
            type: "ACTION_FAILED",
            title: `${action.type} failed`,
            description: err.message,
            success: false,
        });

        throw err;
    }
}