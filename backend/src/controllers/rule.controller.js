import prisma from "../lib/prisma.js";
export const getRules = async (req, res) => {
    const { repoId } = req.params;

    const rules = await prisma.automationRule.findMany({
        where: {
            repositoryId: repoId,
        },
        include: {
            actions: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    res.json(rules);
};

export const createRule = async (req, res) => {
    const { repoId } = req.params;

    const { name, trigger, actions } = req.body;

    const rule = await prisma.automationRule.create({
        data: {
            name,
            trigger,
            repositoryId: repoId,

            actions: {
                create: actions,
            },
        },
        include: {
            actions: true,
        },
    });

    res.status(201).json(rule);
};

export const updateRule = async (req, res) => {
    const { ruleId } = req.params;

    const { name, trigger, enabled, actions } = req.body;

    const formattedActions = actions.map((action) => ({
    type: action.type,
    value: action.value,
}));

    const rule = await prisma.automationRule.update({
        where: {
            id: ruleId,
        },
        data: {
            name,
            trigger,
            enabled,

            actions: {
                deleteMany: {},

                create: formattedActions,
            },
        },
        include: {
            actions: true,
        },
    });

    res.json(rule);
};


export const deleteRule = async (req, res) => {
    const { ruleId } = req.params;

    await prisma.automationRule.delete({
        where: {
            id: ruleId,
        },
    });

    res.json({
        message: "Rule deleted",
    });
};