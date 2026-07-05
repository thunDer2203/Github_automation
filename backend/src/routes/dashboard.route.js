import { Router } from "express";
import {
    getDashboard,
    getDashboardStats,
} from "../controllers/dashboard.controller.js";
import { isAuthenticated } from "../middleware/isAuth.js";

const router = Router();

router.get("/", isAuthenticated, getDashboard);

router.get("/stats", isAuthenticated, getDashboardStats);

export default router;