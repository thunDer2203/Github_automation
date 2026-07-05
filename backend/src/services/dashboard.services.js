import prisma from "../lib/prisma.js";

export async function addDashboardEvent({
    userId,
    repositoryId = null,
    type,
    title,
    description = null,
    success = true,
    metadata = null,
}) {
    await prisma.dashboardEvent.create({
        data: {
            userId,
            repositoryId,
            type,
            title,
            description,
            success,
            metadata,
        },
    });
}