import express from "express";
import {
    getRules,
    createRule,
    updateRule,
    deleteRule,
} from "../controllers/rule.controller.js";

const router = express.Router();

router.get("/:repoId", getRules);
router.post("/:repoId", createRule);

router.put("/:ruleId", updateRule);
router.delete("/:ruleId", deleteRule);

export default router;