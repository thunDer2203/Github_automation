import { createIssueLabel,createIssueComment } from "./github.services.js";
import { sendSlackMessage } from "./slack.services.js";

export async function executeAction({
    action,
    accessToken,
    owner,
    repo,
    issueNumber,
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
            break;
            case "COMMENT":

            await createIssueComment({
                accessToken,
                owner,
                repo,
                issueNumber,
                body: action.value,
            });

            break;
            case "SLACK":

    await sendSlackMessage({
        webhookUrl: action.value,
        message: `New issue opened in ${owner}/${repo}\nIssue: #${issueNumber}`,
    });

    break;
        default:
            console.log("Unknown action:", action.type);
    }
}