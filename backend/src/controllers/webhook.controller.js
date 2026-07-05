import {verifyGithubWebhook} from "../utils/verifyGit.js";
import {processWebhook} from "../services/automation.service.js"; 

export const githubWebhook = async (req, res) => {

    if (!verifyGithubWebhook(req)) {
        return res.status(401).json({
            message: "Invalid webhook signature",
        });
    }
    if(verifyGithubWebhook(req)){
        console.log("Webhook signature verified");
    }

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
    await processWebhook(trigger, payload);
}

res.sendStatus(200);


};