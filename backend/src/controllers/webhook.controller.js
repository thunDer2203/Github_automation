export const githubWebhook = async (req, res) => {

    console.log("========== WEBHOOK ==========");

    console.log(req.headers["x-github-event"]);

    console.log(req.body);

    res.sendStatus(200);

};