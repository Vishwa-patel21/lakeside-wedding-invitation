# Lakeside Wedding Invitation

An animated Next.js wedding invitation designed for GitHub and Vercel.

## Edit The Wedding Details

Most personal details live in:

```text
lib/config.js
```

Change the couple names, date, time, venue, RSVP deadline, WhatsApp number and schedule there.

## Run Locally

```powershell
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Paste and run `supabase/setup.sql`.
4. Copy your project URL and anon key into `.env.local`.

```text
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

RSVP responses appear in the `rsvps` table. Guest photos upload into the private `wedding-photos` storage bucket.

## Deploy

1. Push this folder to GitHub.
2. Import the GitHub repo into Vercel.
3. Add the same two Supabase environment variables in Vercel.
4. Deploy.

After deployment, visit `/photos` and print or share that QR page for guest photo uploads.
