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

    // console.log(req.body);
     await processWebhook(req.body);


    res.sendStatus(200);

};