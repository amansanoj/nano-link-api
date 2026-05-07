import { Hono } from "hono";
import QRCode from "qrcode";
import { getLinkById } from "../db/store";

const qrRoute = new Hono();

qrRoute.get("/:code", async (c) => {
  const code = c.req.param("code");
  const link = getLinkById(code);

  if (!link) {
    return c.json({ success: false, error: "Link not found" }, 404);
  }

  try {
    const baseUrl = new URL(c.req.url).origin;
    const targetUrl = `${baseUrl}/${code}`;

    const buffer = await QRCode.toBuffer(targetUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 400,
      color: {
        dark: "#1a1a1a",
        light: "#fafafa",
      },
    });

    c.header("Content-Type", "image/png");

    return c.body(new Uint8Array(buffer));
  } catch (error) {
    return c.json({ success: false, error: "Failed to generate QR code" }, 500);
  }
});

export default qrRoute;
