import { Hono } from "hono";
import { getLinkById, recordClick } from "../db/store";

const redirectRoute = new Hono();

redirectRoute.get("/:code", (c) => {
  const code = c.req.param("code");

  const link = getLinkById(code);

  if (!link) {
    return c.json({ success: false, error: "Link not found" }, 404);
  }

  recordClick(code);

  return c.redirect(link.originalUrl, 301);
});

export default redirectRoute;
