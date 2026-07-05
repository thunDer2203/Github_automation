import {verifyGithubWebhook} from "../utils/verifyGit.js";
import {processWebhook} from "../services/automation.service.js"; 
import prisma from "../lib/prisma.js";
import { addDashboardEvent } from "../services/dashboard.services.js";

export const githubWebhook = async (req, res) => {

    const deliveryId = req.headers["x-github-delivery"];

const existing = await prisma.processedWebhook.findUnique({
    where: {
        id: deliveryId,
    },
});

if (existing) {
    return res.sendStatus(200);
}

    if (!verifyGithubWebhook(req)) {
        return res.status(401).json({
            message: "Invalid webhook signature",
        });
    }
    // if(verifyGithubWebhook(req)){
    //     console.log("Webhook signature verified");
    // }

    // console.log("========== WEBHOOK ==========");

    // console.log(req.headers["x-github-event"]);
    let event = req.headers["x-github-event"];
    const payload = req.body;


    // console.log(req.body);
     let trigger = null;

if (event === "issues" && payload.action === "opened") {
    trigger = "ISSUE_OPENED";
}

if (event === "pull_request" && payload.action === "opened") {
    trigger = "PR_OPENED";
}

if (trigger) {
    await prisma.webhookJob.create({
        data: {
            trigger,
            payload,
            deliveryId,
        },
    });
}

res.sendStatus(200);


};