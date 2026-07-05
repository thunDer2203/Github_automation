import express from "express";
import {
    getRules,
    createRule,
    updateRule,
    deleteRule,
} from "../controllers/rule.controller.js";
import { isAuthenticated } from "../middleware/isAuth.js";


const router = express.Router();

router.get("/:repoId", isAuthenticated, getRules);
router.post("/:repoId", isAuthenticated, createRule);

router.put("/:ruleId", isAuthenticated, updateRule);
router.delete("/:ruleId", isAuthenticated, deleteRule);

export default router;