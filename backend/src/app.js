import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import gitHubRoutes from "./routes/github.routes.js";
import repoRoutes from "./routes/repo.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import ruleRoutes from "./routes/rule.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";

import "./config/passport.js";

import authRoutes from "./routes/auth.routes.js";

const app = express();



app.use(
    express.json({
        verify: (req, res, buf) => {
            req.rawBody = buf;
        },
    })
);

app.set("trust proxy", 1);


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

        cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/github",gitHubRoutes);
app.use("/repos", repoRoutes);
app.use("/webhooks", webhookRoutes);
app.use("/rules", ruleRoutes);
app.use("/dashboard", dashboardRoutes);

app.get("/",(req,res)=>{res.send("Hello, World!");});

export default app;