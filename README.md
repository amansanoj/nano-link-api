![OG Image](https://repo-og-generator.vercel.app/nano-link-api?description=A%20high-performance%2C%20production-ready%20URL%20Shortener%20API%20built%20with%20Bun%2C%20Hono%2C%20and%20SQLite.&variant=accent&scale=2)

## Index

- [Features](#features)
- [Project Structure](#project-structure)
- [Configuration & Environment](#configuration--environment)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Credits & License](#credits--license)

## Features

- Generates blazingly fast redirects using an in-memory SQLite relational database
- Protects admin endpoints with robust Bearer Token Authentication
- Prevents API abuse with a custom in-memory rate-limiting bouncer (Max 30 req/min)
- Tracks deep demographics natively by parsing OS, Device, and Browser headers
- Fires real-time asynchronous Discord Webhook notifications with rich data embeds on every click
- Handles massive datasets safely via cursor-based pagination on the admin dashboard
- Generates and streams dynamic, scannable QR Code PNGs directly from memory buffers
- Enforces strict data lifecycles with self-destructing links (`expiresAt` / `maxClicks`)

## Project Structure

```text
.
├── .gitignore
├── README.md
├── bun.lock
├── package.json
├── tsconfig.json
├── public
│   ├── index.html
│   ├── input.css
│   └── style.css
└── src
    ├── index.ts
    ├── db
    │   └── store.ts
    ├── middleware
    │   └── rateLimit.ts
    ├── routes
    │   ├── docs.ts
    │   ├── links.ts
    │   ├── qr.ts
    │   ├── redirect.ts
    │   ├── shorten.ts
    │   └── stats.ts
    ├── services
    │   └── discord.ts
    └── types
        └── index.ts
```

`src/index.ts` acts as the main router and authentication gatekeeper. All specific business logic is decoupled into the modular `routes`, `services`, and `db` directories.

## Configuration & Environment

For the API to function securely and communicate with external services, you must configure your environment variables. Create a `.env` file in the root directory:

- `ADMIN_KEY`: Your secret key to access the `/api/links` and `/api/stats` routes.
- `DISCORD_WEBHOOK`: The URL for your Discord server's webhook to receive real-time click notifications.

```env
ADMIN_KEY=YOUR-SECRET-API-KEY
DISCORD_WEBHOOK=YOUR-DISCORD-WEBHOOK-URL
```

## Local Development

To run the API locally and interact with the endpoints:

```sh
bun install
bun run dev
```

The server will spin up at `http://localhost:3000`. Navigate to the root URL in your browser to view the interactive API Documentation page.

## Deployment

Deployment is streamlined for the Hack Club Nest (or any Linux server). Since Bun handles the runtime and SQLite handles the persistence, simply clone the repository to your server, set up your `.env` file, and run the server directly:

```sh
git clone https://github.com/amansanoj/nano-link-api.git
cd nano-link-api
bun install
bun run src/index.ts
```

For persistent production uptime, run the process using `pm2` or a `systemd` background service.

## Credits & License

Constructed using Bun, Hono, and SQLite. Built for the [Hack Club RaspAPI YSWS](https://raspapi.hackclub.com/). This codebase is open-source. Please check the included LICENSE file for redistribution rights and terms.
