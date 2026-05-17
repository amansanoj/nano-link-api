![OG Image](https://repo-og-generator.vercel.app/nanolink-api?description=A%20URL%20shortener%20I%20built%20for%20Hack%20Club%27s%20RaspAPI%20YSWS.%20Runs%20on%20Bun%20and%20Hono%20with%20a%20SQLite%20database.&variant=accent)

## Features

- Shorten URLs with optional custom slugs
- Self-destructing links via `expiresAt` or `maxClicks`
- Tracks OS, browser, and device on every click
- Discord webhook notifications on each redirect
- QR code generation
- Rate limiter on `/api/shorten` (30 req/min per IP)
- Paginated `/api/links` dashboard with `?page=` and `?limit=` params
- Bearer token auth on admin routes via Hono's built-in `bearerAuth`
- Zod validation on all incoming payloads

## Project Structure

```
src/
├── index.ts
├── db/store.ts
├── middleware/rateLimit.ts
├── routes/
├── services/discord.ts
└── types/index.ts
public/
```

## Configuration & Environment

Create a `.env` in the root:

```env
ADMIN_KEY=your-secret-key
DISCORD_WEBHOOK=your-webhook-url
```

`DISCORD_WEBHOOK` is optional.

## Local Development

```sh
bun install
bun run dev
```

Opens at `http://localhost:3000`.

## Deployment

```sh
git clone https://github.com/amansanoj/nanolink-api.git
cd nanolink-api
bun install
bun run src/index.ts
```

Use `pm2` or `systemd` to keep it running. Make sure `nanolink.db` persists between deploys if you want to keep the data.

## Credits & License

Built with Bun, Hono, SQLite, and Zod for the [Hack Club RaspAPI YSWS](https://raspapi.hackclub.com/). Open source — check the LICENSE file.
