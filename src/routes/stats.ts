import { Hono } from "hono";
import { getAllStats, getLinkById } from "../db/store";

const statsRoute = new Hono();

statsRoute.get("/:code", (c) => {
  const code = c.req.param("code");
  const link = getLinkById(code);

  if (!link) {
    return c.json({ success: false, error: "Link not found" }, 404);
  }

  return c.json({ success: true, data: link }, 200);
});

statsRoute.get("/", (c) => {
  const allLinks = getAllStats();

  return c.json(
    { success: true, totalLinks: allLinks.length, data: allLinks },
    200,
  );
});

export default statsRoute;
