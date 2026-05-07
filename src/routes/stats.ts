import { Hono } from "hono";
import { getClickEvents, getLinkById } from "../db/store";

const statsRoute = new Hono();

statsRoute.get("/:code", (c) => {
  const code = c.req.param("code");
  const link = getLinkById(code);

  if (!link) {
    return c.json({ success: false, error: "Link not found" }, 404);
  }

  const demographics = getClickEvents(code);

  return c.json(
    { success: true, data: { ...link, recentActivity: demographics } },
    200,
  );
});

export default statsRoute;
