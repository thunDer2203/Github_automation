import prisma from "../lib/prisma.js";
import { processWebhook } from "./automation.service.js";
import { addDashboardEvent } from "./dashboard.services.js";

export function startJobWorker() {
    console.log("Job worker started");

    setInterval(async () => {
        try {
            const jobs = await prisma.webhookJob.findMany({
                where: {
                    status: {
                        in: ["PENDING", "FAILED"],
                    },
                    retries: {
                        lt: 5,
                    },
                },
                orderBy: {
                    createdAt: "asc",
                },
                take: 5,
            });

            for (const job of jobs) {
                try {

                    await prisma.webhookJob.update({
                        where: {
                            id: job.id,
                        },
                        data: {
                            status: "PROCESSING",
                        },
                    });

                    await processWebhook(
                        job.trigger,
                        job.payload,
                        job.deliveryId
                    );

                    await prisma.processedWebhook.create({
                        data: {
                            id: job.deliveryId,
                        },
                    });

                    await prisma.webhookJob.update({
                        where: {
                            id: job.id,
                        },
                        data: {
                            status: "SUCCESS",
                            error: null,
                        },
                    });

                    const repository = await prisma.repository.findUnique({
    where: {
        githubRepoId: job.payload.repository.id.toString(),
    },
});

if (repository) {
    await addDashboardEvent({
        userId: repository.userId,
        repositoryId: repository.id,
        type: "JOB_SUCCESS",
        title: `Processed ${job.trigger} successfully`,
    });
}

                    console.log(`Job ${job.id} completed`);

                } catch (err) {

                    console.error(err);

                    await prisma.webhookJob.update({
                        where: {
                            id: job.id,
                        },
                        data: {
                            status: "FAILED",
                            retries: {
                                increment: 1,
                            },
                            error: err.message,
                        },
                    });
                    const repository = await prisma.repository.findUnique({
    where: {
        githubRepoId: job.payload.repository.id.toString(),
    },
});

if (job.retries + 1 < 5) {
    await addDashboardEvent({
        userId: repository.userId,
        repositoryId: repository.id,
        type: "JOB_RETRY",
        title: `Retry ${job.retries + 1}/5 for ${job.trigger}`,
        success: false,
    });
}
else {
    await addDashboardEvent({
        userId: repository.userId,
        repositoryId: repository.id,
        type: "JOB_FAILED",
        title: `Job permanently failed`,
        description: err.message,
        success: false,
    });
}
                    console.log(
                        `Job ${job.id} failed (${job.retries + 1}/5)`
                    );
                }
            }

        } catch (err) {
            console.error("Worker Error:", err);
        }

    }, 3000);
}