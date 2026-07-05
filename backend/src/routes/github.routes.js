import { Router } from "express";
import passport from "passport";
import { getGitHubClient } from "../services/github.services.js";

const router = Router();

router.get("/me", async (req, res) => {
    const octokit = getGitHubClient(req.user.accessToken);
    const{data}= await octokit.users.getAuthenticated();
    console.log(data);
})

router.get("/repos", async (req, res) => {
    try{
    const octokit = getGitHubClient(req.user.accessToken);
    const{data}= await octokit.repos.listForAuthenticatedUser({
    sort: "updated",
    per_page: 100,
});
const repos = data.map(repo => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    private: repo.private,
    defaultBranch: repo.default_branch,
    owner: repo.owner.login,
}));

// console.log(repos);
return res.json(repos);

} catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch repositories" });
}
})

export default router;