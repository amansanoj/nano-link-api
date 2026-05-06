import { z } from "zod";

export const createLinkSchema = z.object({
  url: z.url("Must be a valid HTTP/HTTPS URL"),
});

export type CreateLinkRequest = z.infer<typeof createLinkSchema>;

export interface LinkRecord {
  id: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
  lastClicked: string | null;
}