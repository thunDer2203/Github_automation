import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";

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

export default app;