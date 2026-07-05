import prisma from "../lib/prisma.js";

export const getDashboard = async (req, res) => {
    try {
        const {
            type,
            repositoryId,
            success,
            limit = 100,
        } = req.query;

        const where = {
            userId: req.user.id,
        };

        if (type) {
            where.type = type;
        }

        if (repositoryId) {
            where.repositoryId = repositoryId;
        }

        if (success !== undefined) {
            where.success = success === "true";
        }

        const events = await prisma.dashboardEvent.findMany({
            where,
            include: {
                repository: {
                    select: {
                        name: true,
                        fullName: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: Number(limit),
        });

        res.json(events);

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Something went wrong",
        });
    }
};
 

export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const [
            totalEvents,
            successfulEvents,
            failedEvents,
            connectedRepositories,
            labelsAdded,
            commentsAdded,
            slackNotifications,
            rulesCreated,
            rulesUpdated,
            rulesDeleted,
        ] = await Promise.all([
            prisma.dashboardEvent.count({
                where: { userId },
            }),

            prisma.dashboardEvent.count({
                where: {
                    userId,
                    success: true,
                },
            }),

            prisma.dashboardEvent.count({
                where: {
                    userId,
                    success: false,
                },
            }),

            prisma.repository.count({
                where: {
                    userId,
                },
            }),

            prisma.dashboardEvent.count({
                where: {
                    userId,
                    type: "LABEL_ADDED",
                },
            }),

            prisma.dashboardEvent.count({
                where: {
                    userId,
                    type: "COMMENT_ADDED",
                },
            }),

            prisma.dashboardEvent.count({
                where: {
                    userId,
                    type: "SLACK_SENT",
                },
            }),

            prisma.dashboardEvent.count({
                where: {
                    userId,
                    type: "RULE_CREATED",
                },
            }),

            prisma.dashboardEvent.count({
                where: {
                    userId,
                    type: "RULE_UPDATED",
                },
            }),

            prisma.dashboardEvent.count({
                where: {
                    userId,
                    type: "RULE_DELETED",
                },
            }),
        ]);

        res.json({
            totalEvents,
            successfulEvents,
            failedEvents,
            connectedRepositories,
            labelsAdded,
            commentsAdded,
            slackNotifications,
            rulesCreated,
            rulesUpdated,
            rulesDeleted,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Something went wrong",
        });
    }
};