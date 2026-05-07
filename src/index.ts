import { Hono } from "hono";
import shortenRoute from "./routes/shorten";
import redirectRoute from "./routes/redirect";
import statsRoute from "./routes/stats";
import docsRoute from "./routes/docs";
import { serveStatic } from "hono/bun";
import qrRoute from "./routes/qr";

const app = new Hono();

app.use("/public/*", serveStatic({ root: "./" }));

app.get("/", (c) => c.redirect("/docs"));

app.route("/docs", docsRoute);
app.route("/api/shorten", shortenRoute);
app.route("/", redirectRoute);
app.route("/api/stats", statsRoute);
app.route("/api/links", statsRoute);
app.route("/api/qr", qrRoute);

export default app;
