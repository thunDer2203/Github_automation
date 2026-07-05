    import prisma from "../lib/prisma.js";
    import { executeAction } from "./actionExecutor.js";
    import { checkConditions } from "./condition.service.js";

    export async function processWebhook(trigger, payload) {

        const resource =payload.issue || payload.pull_request;


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
                trigger:trigger,
                enabled: true,
            },
            include: {
                actions: true,
                conditions: true,
            },
        });

        for (const rule of rules) {
            const passed = checkConditions(
        rule.conditions,
        payload
    );

    if (!passed) continue;
            for (const action of rule.actions) {
                await executeAction({
                    action,
                    accessToken: user.accessToken,
                    owner: payload.repository.owner.login,
                    repo: payload.repository.name,
                    issueNumber: resource.number,
                    userId: user.id,
                    repositoryId: repository.id,
                    payload,
                });
            }
        }
    }

