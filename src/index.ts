import { Hono } from "hono";
import shortenRoute from "./routes/shorten";
import redirectRoute from "./routes/redirect";
import statsRoute from "./routes/stats";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    name: "NanoLink API",
    description: "A URL shortener and analytics engine.",
    status: "Online",
    endpoints: {
      "POST /api/shorten": {
        description: "Creates a new short link",
        body: { url: "" },
      },
      "GET /:code": "Redirects to the original URL",
      "GET /api/stats/:code": "View click analytics for a specific link",
      "GET /api/links": "View all active shortened links",
    },
  });
});

app.route("/api/shorten", shortenRoute);
app.route("/", redirectRoute);
app.route("/api/stats", statsRoute);
app.route("/api/links", statsRoute);

export default app;
