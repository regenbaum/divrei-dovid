# Divrei Dovid

The Torah & legacy of Rabbi David Ebner zt"l — a Next.js site currently
using a public Google Drive folder as its content source.

## Running locally

```
npm install
npm run dev
```

## Environment variables (set in Vercel → Project Settings → Environment Variables)

- `GOOGLE_DRIVE_API_KEY` — required for the Shiurim page and homepage
  featured cards to actually list files. Without it, the site still builds
  and runs, just with empty shiur lists.

  **How to get one (10 minutes, no coding):**
  1. Go to https://console.cloud.google.com and create a project (any name).
  2. In the search bar, search "Google Drive API" and click **Enable**.
  3. Go to **APIs & Services → Credentials → Create Credentials → API key**.
  4. Copy the key. Optionally click "Restrict key" → under "API restrictions"
     choose "Google Drive API" only, for safety.
  5. Paste it into Vercel as `GOOGLE_DRIVE_API_KEY`.

  This only ever reads the public Divrei Dovid Drive folder — it can't
  access anything else in your Drive account.

- `GOOGLE_DRIVE_FOLDER_ID` — optional, defaults to the existing folder
  (`1zIhSM2q9Kt-xAIa3muG7lZhbKBm70Q3s`). Only change this if the archive
  moves to a different folder.

- `NEXT_PUBLIC_FORMSPREE_SUPPORT_ID`, `NEXT_PUBLIC_FORMSPREE_CONTRIBUTE_ID`,
  `NEXT_PUBLIC_FORMSPREE_TRIBUTE_ID` — power the three "Get Involved" forms
  without ever exposing your email address anywhere in the site's code.

  **How to get these (5 minutes, no coding):**
  1. Go to https://formspree.io and create a free account with the email
     you want submissions delivered to.
  2. Create three forms (Support, Contribute, Tribute). Each gives you a
     form ID that looks like `abcd1234`.
  3. Paste each ID into the matching Vercel environment variable.

## Featuring specific shiurim on the homepage

Edit `lib/featured.js` and replace the placeholder `driveFileId` values with
real Google Drive file IDs (open a file in Drive, copy the ID out of the
URL between `/d/` and `/view`).

## Adding approved tributes

Tributes submitted through the form land in your Formspree inbox first.
To publish an approved one, add it as an entry in `data/tributes.json`:

```json
[
  { "name": "Jane Doe", "display": "named", "connection": "Yeshivat HaMivtar", "memory": "..." }
]
```

Use `"display": "anonymous"` to hide the name.

## Editing site text from the admin panel

Visit `/admin/login` on the live site (there's a small "Admin" link in the
footer) and sign in with the password you set below. You'll get a simple
form for every page's text — edit it, hit Save, and the change is committed
straight to GitHub, which triggers Vercel to automatically rebuild and
redeploy (usually live within a minute).

**Setup (one-time, in Vercel → Project Settings → Environment Variables):**

1. `ADMIN_PASSWORD` — pick a long, unique password. This is the only thing
   protecting the editor, so don't reuse a password from anywhere else.
2. `ADMIN_SESSION_SECRET` — a random signing key for login sessions.
   Generate one with `openssl rand -hex 32`, or any password generator
   (40+ random characters).
3. A GitHub token so saved edits can be committed automatically:
   - Go to https://github.com/settings/tokens?type=beta
   - Generate a new **fine-grained** token
   - Under "Repository access," choose **Only select repositories** →
     `regenbaum/divrei-dovid`
   - Under "Permissions," set **Contents: Read and write**
   - Copy the token into `GITHUB_TOKEN`
   - Also set `GITHUB_OWNER=regenbaum`, `GITHUB_REPO=divrei-dovid`,
     `GITHUB_BRANCH=main` (all already defaulted in the code, but explicit
     is safer)

Without these three set, the site and every other page work fine — only
the admin editor's save step will show a clear error telling you what's
missing.

## When this outgrows Google Drive

Everything that reads shiur data goes through two functions in
`lib/content.js`: `getAllShiurim()` and `getFeaturedShiurim()`. When you
move to a real database (Airtable, Supabase, etc.), only the *inside* of
`getAllShiurim()` needs to change — every page already calls that function,
not Google Drive directly.
