import { createIssueLabel,createIssueComment } from "./github.services.js";
import { sendSlackMessage } from "./slack.services.js";
import { addDashboardEvent } from "./dashboard.services.js";

export async function executeAction({
    action,
    accessToken,
    owner,
    repo,
    issueNumber,
    userId,
    repositoryId,
}) {
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

    await sendSlackMessage({
        webhookUrl: action.value,
        message: `New issue opened in ${owner}/${repo}\nIssue: #${issueNumber}`,
    });
    await addDashboardEvent({
    userId,
    repositoryId,
    type: "SLACK_SENT",
    title: "Slack notification sent",
    description: `${owner}/${repo}`,
});
    break;
        default:
            console.log("Unknown action:", action.type);
    }
}