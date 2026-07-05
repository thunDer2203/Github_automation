import prisma from "../lib/prisma.js";
import { executeAction } from "./actionExecutor.js";

export async function processWebhook(payload) {

    if (payload.action !== "opened") {
        return;
    }

    const repository = await prisma.repository.findUnique({
        where: {
            githubRepoId: payload.repository.id.toString(),
        },
    });

    if (!repository) {
        console.log("Repository not connected");
        return;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: repository.userId,
        },
    });

    const rules = await prisma.automationRule.findMany({
        where: {
            repositoryId: repository.id,
            trigger: "ISSUE_OPENED",
            enabled: true,
        },
        include: {
            actions: true,
        },
    });

    for (const rule of rules) {
        for (const action of rule.actions) {
            await executeAction({
                action,
                accessToken: user.accessToken,
                owner: payload.repository.owner.login,
                repo: payload.repository.name,
                issueNumber: payload.issue.number,
            });
        }
    }
}

