import { Database } from "bun:sqlite";
import type { LinkRecord } from "../types";

const db = new Database("nanolink.db", { create: true });

db.transaction(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS links (
      id TEXT PRIMARY KEY,
      originalUrl TEXT NOT NULL,
      clicks INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      lastClicked TEXT,
      expiresAt TEXT,
      maxClicks INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS click_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      linkId TEXT NOT NULL,
      os TEXT,
      browser TEXT,
      device TEXT,
      clickedAt TEXT NOT NULL,
      FOREIGN KEY (linkId) REFERENCES links(id) ON DELETE CASCADE
    )
  `);
})();

export const insertLink = (record: LinkRecord) => {
  const query = db.query(`
    INSERT INTO links (id, originalUrl, clicks, createdAt, lastClicked, expiresAt, maxClicks)
    VALUES ($id, $originalUrl, $clicks, $createdAt, $lastClicked, $expiresAt, $maxClicks)
  `);

  query.run({
    $id: record.id,
    $originalUrl: record.originalUrl,
    $clicks: record.clicks,
    $createdAt: record.createdAt,
    $lastClicked: record.lastClicked,
    $expiresAt: record.expiresAt,
    $maxClicks: record.maxClicks,
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

export const deleteLink = (id: string) => {
  db.query(`DELETE FROM links WHERE id = $id`).run({ $id: id });
};

export const insertClickEvent = (
  linkId: string,
  os: string,
  browser: string,
  device: string,
) => {
  db.query(
    `
    INSERT INTO click_events (linkId, os, browser, device, clickedAt)
    VALUES ($linkId, $os, $browser, $device, $clickedAt)
  `,
  ).run({
    $linkId: linkId,
    $os: os || "Unknown",
    $device: device || "Desktop",
    $clickedAt: new Date().toISOString(),
  });
};

export const getClickEvents = (linkId: string) => {
  return db
    .query(
      `SELECT os, browser, device, clickedAt FROM click_events WHERE linkId = $linkId`,
    )
    .all({ $linkId: linkId });
};

export const getLinksCount = () => {
  const result = db.query(`SELECT COUNT(*) as count FROM links`).get() as {
    count: number;
  };

  return result.count;
};

export const getPaginatedLinks = (limit: number, offset: number) => {
  return db
    .query(
      `
    SELECT id, originalUrl, clicks, createdAt, expiresAt
    FROM links
    ORDER BY createdAt DESC
    LIMIT $limit OFFSET $offset
  `,
    )
    .all({
      $limit: limit,
      $offset: offset,
    });
};
