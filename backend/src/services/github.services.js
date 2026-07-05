import { Octokit } from "@octokit/rest";

export function getGitHubClient(accessToken) {
    return new Octokit({
        auth: accessToken,
    });
}




export async function createIssueComment({
    accessToken,
    owner,
    repo,
    issueNumber,
    body,
}) {
    const github = getGitHubClient(accessToken);

    return await github.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body,
    });
}

export async function createIssueLabel({
    accessToken,
    owner,
    repo,
    issueNumber,
    labels,
}) {
    const github = getGitHubClient(accessToken);

    return await github.rest.issues.addLabels({
        owner,
        repo,
        issue_number: issueNumber,
        labels,
    });
}

export async function deleteWebhook({
    accessToken,
    owner,
    repo,
    hookId,
}) {
    const github = getGitHubClient(accessToken);

    await github.rest.repos.deleteWebhook({
        owner,
        repo,
        hook_id: hookId,
    });
}