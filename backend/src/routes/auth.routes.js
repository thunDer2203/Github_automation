import { Router } from "express";
import passport from "passport";

import {
    githubCallback,
    me,
    logout,
} from "../controllers/auth.controller.js";

const router = Router();

router.get(
    "/github",
    passport.authenticate("github", {
        scope: ["repo", "read:user"],
    })
);

router.get(
    "/github/callback",
    passport.authenticate("github", {
        failureRedirect: "/",
    }),
    githubCallback
);

router.get("/me", me);

router.get("/logout", logout);

export default router;