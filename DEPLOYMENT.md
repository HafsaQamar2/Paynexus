# Deploying PayNexus for free

You need two things: somewhere to run the Next.js app, and somewhere to run
MySQL. Both of the options below have a genuinely free tier (no trial that
expires, no credit card surprise) as of mid-2026.

> **Recommended combo:** Vercel (app) + Aiven (MySQL). Total cost: **$0**.
> Total setup time: **~15 minutes**.

---

## 1. Get a free MySQL database (Aiven)

Aiven's free tier gives you a permanent, always-on MySQL instance (1 CPU /
1 GB RAM / 5 GB storage) with no credit card required.

1. Go to **aiven.io** and sign up.
2. Click **Create service** → choose **MySQL**.
3. Pick the **Free plan** and any region close to you.
4. Once it's running, open the service and copy the **Service URI** —
   it looks like:
   ```
   mysql://avnadmin:PASSWORD@mysql-xxxx.aivencloud.com:12345/defaultdb?ssl-mode=REQUIRED
   ```
5. That whole string is your `DATABASE_URL`.

**Alternatives** if you want a backup option or Aiven changes its plans:
- **Clever Cloud** — free MySQL "Dev" plan, no card required for the free tier.
- **db4free.net** — free shared MySQL, fine for a hackathon demo, slower and less private.
- A **local MySQL** (via XAMPP/MySQL Workbench/Docker) works too if you only need to *demo on your own laptop* during judging rather than host a public link.

## 2. Push your schema to that database

Locally, with your `.env` pointing at the Aiven `DATABASE_URL`:

```bash
npm install
npm run db:push     # creates all the tables
npm run db:seed     # optional: adds a starter admin account + sample data
```

## 3. Deploy the app (Vercel)

1. Push this project to a GitHub repository.
2. Go to **vercel.com** → **Add New Project** → import that repository.
3. Vercel auto-detects Next.js — leave the build settings as default.
4. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `DATABASE_URL` | your Aiven connection string from step 1 |
   | `JWT_SECRET` | any long random string (e.g. generate one with `openssl rand -base64 32`) |
   | `NEXT_PUBLIC_APP_URL` | your Vercel URL, e.g. `https://paynexus-yourname.vercel.app` (you can add this after the first deploy gives you the URL, then redeploy) |
5. Click **Deploy**.

That's it — you now have a public link you can send to hackathon judges. The
"**Try Live Demo**" button on the landing page works immediately with no
extra setup, because it generates its own sandbox data on first click.

## 4. (Optional) Custom domain

Vercel gives you a free `*.vercel.app` subdomain automatically — good enough
for a hackathon submission. If you want a custom domain, Vercel supports
adding one for free; you only pay if you buy the domain itself.

---

## Why this combo, and what to avoid

- **Railway** no longer offers a permanent free tier (only a time-limited
  trial that asks for card details) — fine for a quick test, but don't build
  your submission link around it expiring mid-judging.
- **PlanetScale** removed its free Hobby tier in 2024 — skip it for this project.
- Anything that requires you to keep your own laptop running (like a raw
  `mysql` install with port-forwarding) is fragile for a judged demo — use
  Aiven + Vercel so the link works whether or not your machine is on.

## Running it locally instead (for development in VS Code)

```bash
git clone <your-repo-url>
cd paynexus
npm install
cp .env.example .env       # then fill in DATABASE_URL and JWT_SECRET
npm run db:push
npm run db:seed            # optional
npm run dev                 # open http://localhost:3000
```

See the root [`README.md`](./README.md) for the full local setup walkthrough,
including VS Code extensions and the project structure.
