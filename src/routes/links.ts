import { Hono } from "hono";
import { getLinksCount, getPaginatedLinks } from "../db/store";

const linksRoute = new Hono();

linksRoute.get("/", (c) => {
  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "10");

  if (page < 1 || limit < 1) {
    return c.json(
      { success: false, error: "Page and limit must be positive integers." },
      400,
    );
  }

  const offset = (page - 1) * limit;

  const totalLinks = getLinksCount();
  const totalPages = Math.ceil(totalLinks / limit);
  const data = getPaginatedLinks(limit, offset);

  return c.json(
    {
      success: true,
      meta: {
        totalItems: totalLinks,
        totalPages: totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
      data: data,
    },
    200,
  );
});

export default linksRoute;
