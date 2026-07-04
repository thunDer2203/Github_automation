import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import gitHubRoutes from "./routes/github.routes.js";
import repoRoutes from "./routes/repo.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";

import "./config/passport.js";

import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/github",gitHubRoutes);
app.use("/repos", repoRoutes);
app.use("/webhooks", webhookRoutes);

app.get("/",(req,res)=>{res.send("Hello, World!");});

export default app;