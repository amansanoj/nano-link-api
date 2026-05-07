import { ParsedFormValue } from "hono/types";
import { z } from "zod";

export const createLinkSchema = z.object({
  url: z.url("Must be a valid HTTP/HTTPS URL"),
  customCode: z
    .string()
    .min(3, "Custom code must be at least 3 characters")
    .max(20, "Custom code cannot exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "Custom code can only contain letters, numbers, and hyphens",
    )
    .optional(),
  expiresAt: z.iso.datetime("Must be a valid ISO datetime string").optional(),
  maxClicks: z.number().int().positive("Must be a positive integer").optional(),
});

export type CreateLinkRequest = z.infer<typeof createLinkSchema>;

export interface LinkRecord {
  id: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
  lastClicked: string | null;
  expiresAt: string | null;
  maxClicks: number | null;
}
