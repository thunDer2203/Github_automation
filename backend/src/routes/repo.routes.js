import express from "express";

import {
    connectRepository,
    disconnectRepository,
    getRepositories,
} from "../controllers/repository.controller.js";

import { isAuthenticated } from "../middleware/isAuth.js";

const router = express.Router();

router.get("/", isAuthenticated, getRepositories);

router.post("/", isAuthenticated, connectRepository);

router.delete("/:id", isAuthenticated, disconnectRepository);


export default router;