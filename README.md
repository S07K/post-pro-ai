# PostProAI

An AI-powered social media post generator: create a project, generate a post image with DALL-E-3, write a caption, and publish immediately or schedule it for later to Instagram (via a connected Facebook Page).

A single full-stack Next.js 14 (App Router) application — API routes, MongoDB/Mongoose data layer, and the UI all live in this repo. There is no separate backend service.

## Stack

- **Framework:** Next.js 14 (App Router), TypeScript (strict)
- **UI:** NextUI, Tailwind CSS
- **Auth:** NextAuth (credentials provider, bcrypt-hashed passwords, JWT sessions)
- **Database:** MongoDB via Mongoose
- **Storage:** Firebase Storage (generated post images)
- **AI:** OpenAI (DALL-E-3), server-side key only
- **Publishing:** Meta Graph API (Instagram business accounts via a connected Facebook Page)
- **Scheduling:** Vercel Cron (`vercel.json`) publishes scheduled posts and resumes any left mid-publish

## Getting started

1. Copy `example.env` to `.env.local` and fill in the values (see below).
2. Install dependencies and start the dev server:

   ```bash
   yarn install
   yarn dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

You'll need a MongoDB instance (local `mongod` or a hosted cluster) reachable at `MONGO_URI`.

## Environment variables

See `example.env` for the full list. At minimum for local development you need:

- `MONGO_URI` — MongoDB connection string
- `NEXTAUTH_SECRET` — random secret for session signing (`openssl rand -base64 32`)
- `OPENAI_API_KEY` — used server-side only for image generation; never sent to the client
- Firebase project config — for storing generated images
- Facebook app config (`NEXT_PUBLIC_APP_ID`, `NEXT_PUBLIC_CONFIG_ID`, `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`) — for the Instagram connect/publish flow
- `CRON_SECRET` — required by `/api/cron/publish-scheduled` in production (Vercel sets this automatically for its own cron invocations if configured)

## Architecture

```
lib/
  db/           mongoose connection (cached for serverless) + models (User, Project, Post)
  validation/   zod schemas for every mutation
  api/          session helper, response helpers, DTO serializers, typed client for the frontend
  auth.ts       NextAuth config
  openai.ts     server-side DALL-E-3 generation
  meta.ts       Instagram Graph API publish flow
  scheduler.ts  shared publish/resume logic used by both the immediate-publish path and the cron job
app/
  api/          Route Handlers — auth, projects, posts, openai, analytics, cron
  ...           pages, using lib/api/client.ts for all data fetching
```

Key design notes:

- Every mutation is scoped to the authenticated user (`session.user.id`); there is no client-supplied user/owner id anywhere in the API.
- Instagram publishing does a short bounded poll for the media container to finish processing, then falls back to leaving the post `status: "processing"` for the cron job to finish — this avoids blocking a serverless function past its time limit.
- Analytics and dashboard history are computed from real `Post` documents belonging to the signed-in user — no mock data.

## Scripts

- `yarn dev` — start the dev server
- `yarn build` — production build
- `yarn lint` — ESLint
