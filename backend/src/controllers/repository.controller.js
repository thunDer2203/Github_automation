import prisma from "../lib/prisma.js";

export const getRepositories = async (req, res) => {
    try {
        const repositories = await prisma.repository.findMany({
            where: {
                userId: req.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json(repositories);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Something went wrong",
        });
    }
};

export const connectRepository = async (req, res) => {
    try {
        const {
            githubRepoId,
            name,
            fullName,
            owner,
            private: isPrivate,
            defaultBranch,
        } = req.body;

        const existing = await prisma.repository.findUnique({
            where: {
                githubRepoId,
            },
        });

        if (existing) {
            return res.status(400).json({
                message: "Repository already connected",
            });
        }

        const repository = await prisma.repository.create({
            data: {
                githubRepoId,
                name,
                fullName,
                owner,
                private: isPrivate,
                defaultBranch,
                userId: req.user.id,
            },
        });

        res.status(201).json(repository);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Something went wrong",
        });
    }
};

export const disconnectRepository = async (req, res) => {
    try {
        const { id } = req.params;

        const repository = await prisma.repository.findUnique({
            where: {
                id,
            },
        });

        if (!repository) {
            return res.status(404).json({
                message: "Repository not found",
            });
        }

        if (repository.userId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden",
            });
        }

        await prisma.repository.delete({
            where: {
                id,
            },
        });

        res.json({
            message: "Repository disconnected",
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Something went wrong",
        });
    }
};