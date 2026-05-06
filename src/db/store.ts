import { Database } from "bun:sqlite";
import type { LinkRecord } from "../types";

const db = new Database("nanolink.db", { create: true });

db.query(
  `
    CREATE TABLE IF NOT EXISTS links (
      id TEXT PRIMARY KEY,
      originalUrl TEXT NOT NULL,
      clicks INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      lastClicked TEXT
  )
`,
).run();

export const insertLink = (record: LinkRecord) => {
  const query = db.query(`
    INSERT INTO links (id, originalUrl, clicks, createdAt, lastClicked)
    VALUES ($id, $originalUrl, $clicks, $createdAt, $lastClicked)
  `);

  query.run({
    $id: record.id,
    $originalUrl: record.originalUrl,
    $clicks: record.clicks,
    $createdAt: record.createdAt,
    $lastClicked: record.lastClicked,
  });
};

export const getLinkById = (id: string): LinkRecord | null => {
  const query = db.query(`SELECT * FROM links WHERE id = $id`);
  return query.get({ $id: id }) as LinkRecord | null;
};

export const recordClick = (id: string) => {
  const now = new Date().toISOString();
  const query = db.query(`
    UPDATE links
    SET clicks = clicks + 1, lastClicked = $now
    WHERE id = $id
  `);

  query.run({ $now: now, $id: id });
};

export const getAllStats = (): LinkRecord[] => {
  const query = db.query(`SELECT * FROM links ORDER BY clicks DESC`);
  return query.all() as LinkRecord[];
};
