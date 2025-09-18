import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv"

const app = express()
dotenv.config({
    path: './.env'
})

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import adminCieRouter from "./routes/admin/cie.route.js";
import adminEventRouter from "./routes/admin/event.route.js";
import adminFormRouter from "./routes/admin/form.route.js";
import adminPollRouter from "./routes/admin/poll.route.js";
import adminVaultRouter from "./routes/admin/vault.route.js";

app.use("/admin/cie",adminCieRouter)
app.use("/admin/event",adminEventRouter)
app.use("/admin/form",adminFormRouter)
app.use("/admin/poll",adminPollRouter)
app.use("/admin/vault",adminVaultRouter)

import authRouter from "./routes/user/auth.route.js";
import cieRouter from "./routes/user/cie.route.js";
import eventRouter from "./routes/user/event.route.js";
import formRouter from "./routes/user/form.route.js";
import pollRouter from "./routes/user/poll.route.js";
import vaultRouter from "./routes/user/vault.route.js";
import dashboardRouter from "./routes/user/dashboard.route.js"


app.use("/auth",authRouter)
app.use("/cie",cieRouter)
app.use("/event",eventRouter)
app.use("/form",formRouter)
app.use("/poll",pollRouter)
app.use("/vault",vaultRouter)
app.use("/dashboard",dashboardRouter)


app.use("/",(req,res)=>{
    res.send("404: Page Not Found")
})

export { app }