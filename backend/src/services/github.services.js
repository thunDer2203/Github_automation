import { Octokit } from "@octokit/rest";

export function getGitHubClient(accessToken) {
    return new Octokit({
        auth: accessToken,
    });
}