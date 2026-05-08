import { Context, Next } from "hono";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;

export const rateLimiter = async (c: Context, next: Next) => {
  const ip = c.req.header("x-forwarded-for") || "127.0.0.1";
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    await next();
    return;
  }

  if (now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    await next();
    return;
  }

  if (record.count >= MAX_REQUESTS) {
    return c.json(
      {
        success: false,
        error:
          "Rate limit exceeded. Please wait a minute before creating more links.",
      },
      429,
    );
  }

  record.count += 1;
  rateLimitMap.set(ip, record);
  await next();
};
