    import prisma from "../lib/prisma.js";
    import { executeAction } from "./actionExecutor.js";
    import { checkConditions } from "./condition.service.js";

    export async function processWebhook(trigger, payload,deliveryId) {

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

let hasFailures = false;

for (const rule of rules) {

    const passed = checkConditions(rule.conditions, payload);

    if (!passed) continue;

    for (const action of rule.actions) {

        // Skip if this action already succeeded for this GitHub delivery
        const alreadyExecuted = await prisma.executedAction.findUnique({
            where: {
                deliveryId_actionId: {
                    deliveryId,
                    actionId: action.id,
                },
            },
        });

        if (alreadyExecuted) {
            console.log(
                `Skipping ${action.type} (already executed)`
            );
            continue;
        }

        try {

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

            // Mark action as completed
            await prisma.executedAction.create({
                data: {
                    deliveryId,
                    actionId: action.id,
                },
            });

        } catch (err) {

            console.error(
                `Action ${action.type} failed for rule ${rule.name}:`,
                err.message
            );

            hasFailures = true;
        }
    }
}

if (hasFailures) {
    throw new Error("One or more actions failed.");
}
    }

