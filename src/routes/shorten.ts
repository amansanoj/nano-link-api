import { Hono } from "hono";
import { createLinkSchema } from "../types";
import { insertLink } from "../db/store";
import { success } from "zod";

const shortenRoute = new Hono();

const generateCode = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";

  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

shortenRoute.post("/", async (c) => {
  try {
    const body = await c.req.json();

    const parsed = createLinkSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        { success: false, error: "Invalid HTTP/HTTPS URL provided." },
        400,
      );
    }

    const code = generateCode();

    insertLink({
      id: code,
      originalUrl: parsed.data.url,
      clicks: 0,
      createdAt: new Date().toISOString(),
      lastClicked: null,
    });

    const baseUrl = new URL(c.req.url).origin;

    return c.json(
      {
        success: true,
        message: "Link shortened successfully!",
        code: code,
        shortUrl: `${baseUrl}/${code}`,
        originalUrl: parsed.data.url,
      },
      201,
    );
  } catch (error) {
    return c.json({ success: false, error: "Internal Server Error" }, 500);
  }
});

export default shortenRoute;
