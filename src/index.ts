import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { bearerAuth } from "hono/bearer-auth";

import shortenRoute from "./routes/shorten";
import redirectRoute from "./routes/redirect";
import statsRoute from "./routes/stats";
import linksRoute from "./routes/links";
import docsRoute from "./routes/docs";
import qrRoute from "./routes/qr";

const app = new Hono();

const token = process.env.ADMIN_KEY || "";

app.use("/public/*", serveStatic({ root: "./" }));
app.get("/", (c) => c.redirect("/docs"));

app.use("/api/stats/*", bearerAuth({ token }));
app.use("/api/links/*", bearerAuth({ token }));
app.use("/api/links", bearerAuth({ token }));

app.route("/docs", docsRoute);
app.route("/api/shorten", shortenRoute);
app.route("/api/qr", qrRoute);
app.route("/api/stats", statsRoute);
app.route("/api/links", linksRoute);
app.route("/", redirectRoute);

export default app;
