import { Hono } from "hono";
import { createLinkSchema } from "../types";
import { insertLink, getLinkById } from "../db/store";

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
        { success: false, error: parsed.error.issues[0].message },
        400,
      );
    }

    let code = parsed.data.customCode;

    if (code) {
      const existingLink = getLinkById(code);
      if (existingLink) {
        return c.json(
          {
            success: false,
            error: `The custom code '${code}' is already taken.`,
          },
          409,
        );
      }
    } else {
      code = generateCode();
      while (getLinkById(code)) {
        code = generateCode();
      }
    }

    insertLink({
      id: code,
      originalUrl: parsed.data.url,
      clicks: 0,
      createdAt: new Date().toISOString(),
      lastClicked: null,
      expiresAt: parsed.data.expiresAt || null,
      maxClicks: parsed.data.maxClicks || null,
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
