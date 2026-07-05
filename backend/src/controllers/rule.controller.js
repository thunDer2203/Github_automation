import prisma from "../lib/prisma.js";
import { addDashboardEvent } from "../services/dashboard.services.js";

export const getRules = async (req, res) => {
    const { repoId } = req.params;

    const rules = await prisma.automationRule.findMany({
        where: {
            repositoryId: repoId,
        },
        include: {
            actions: true,
            conditions: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    
    res.json(rules);
};

export const createRule = async (req, res) => {
    const { repoId } = req.params;

    const { name, trigger, actions,conditions } = req.body;

    const repository = await prisma.repository.findUnique({
    where: {
        id: repoId,
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
   
const rule = await prisma.automationRule.create({
    data: {
        name,
        trigger,
        repositoryId:repoId,

        conditions: {
            create: conditions,
        },

        actions: {
            create: actions,
        },
    },

    include: {
        actions: true,
        conditions: true,
    },
});

    await addDashboardEvent({
    userId: req.user.id,
    repositoryId,
    type: "RULE_CREATED",
    title: `Created rule "${rule.name}"`,
});
    res.status(201).json(rule);
};

export const updateRule = async (req, res) => {
    const { ruleId } = req.params;


    const existingRule = await prisma.automationRule.findUnique({
    where: {
        id: ruleId,
    },
    include: {
        repository: true,
    },
});

if (!existingRule) {
    return res.status(404).json({
        message: "Rule not found",
    });
}

if (existingRule.repository.userId !== req.user.id) {
    return res.status(403).json({
        message: "Forbidden",
    });
}

    const { name, trigger, enabled, actions,conditions } = req.body;

    const formattedActions = actions.map((action) => ({
    type: action.type,
    value: action.value,
}));

const formattedConditions = conditions.map((condition) => ({
    field: condition.field,
    operator: condition.operator,
    value: condition.value,
}));

    
    const rule = await prisma.automationRule.update({
        where: {
            id: ruleId,
        },

        data: {
            name,
            trigger,
            enabled,

            conditions: {
                deleteMany: {},

                create: formattedConditions,
            },

            actions: {
                deleteMany: {},

                create: formattedActions,
            },
        },

        include: {
            actions: true,
            conditions: true,
        },
    });

await addDashboardEvent({
    userId: req.user.id,
    repositoryId: rule.repositoryId,
    type: "RULE_UPDATED",
    title: `Updated rule "${rule.name}"`,
});
    res.json(rule);
};


export const deleteRule = async (req, res) => {
    const { ruleId } = req.params;

    const rule = await prisma.automationRule.findUnique({
    where: {
        id: ruleId,
    },
    include: {
        repository: true,
    },
});

if (!rule) {
    return res.status(404).json({
        message: "Rule not found",
    });
}

if (rule.repository.userId !== req.user.id) {
    return res.status(403).json({
        message: "Forbidden",
    });
}
    

    await prisma.automationRule.delete({
        where: {
            id: ruleId,
        },
    });
await addDashboardEvent({
    userId: req.user.id,
    repositoryId: rule.repositoryId,
    type: "RULE_DELETED",
    title: `Deleted rule "${rule.name}"`,
});
    res.json({
        message: "Rule deleted",
    });
};