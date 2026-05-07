import { Hono } from "hono";
import { getAllLinks } from "../db/store";

const linksRoute = new Hono();

linksRoute.get("/", (c) => {
  const allLinks = getAllLinks();
  return c.json({ success: true, count: allLinks.length, data: allLinks }, 200);
});

export default linksRoute;
