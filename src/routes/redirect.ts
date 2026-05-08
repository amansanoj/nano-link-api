import { Hono } from "hono";
import {
  deleteLink,
  getLinkById,
  insertClickEvent,
  recordClick,
} from "../db/store";
import { UAParser } from "ua-parser-js";
import { sendDiscordNotification } from "../services/discord";

const redirectRoute = new Hono();

redirectRoute.get("/:code", (c) => {
  const code = c.req.param("code");

  const link = getLinkById(code);

  if (!link) {
    return c.json({ success: false, error: "Link not found" }, 404);
  }

  if (link.expiresAt && new Date() > new Date(link.expiresAt)) {
    deleteLink(code);
    return c.text("This link has expired and self-destructed", 410);
  }

  if (link.maxClicks !== null && link.clicks >= link.maxClicks) {
    deleteLink(code);
    return c.text(
      "This link has reached its maximum view count and self-destructed",
      410,
    );
  }

  const userAgentString = c.req.header("user-agent") || "";
  const parser = new UAParser(userAgentString);
  const result = parser.getResult();

  const osName = result.os.name || "Unknown";
  const browserName = result.browser.name || "Unknown";
  const deviceType = result.device.type || "Desktop";

  insertClickEvent(code, osName, browserName, deviceType);

  recordClick(code);

  sendDiscordNotification(
    code,
    link.originalUrl,
    osName,
    browserName,
    deviceType,
  );

  return c.redirect(link.originalUrl, 301);
});

export default redirectRoute;
