# Townley Creative

The website for Townley Creative, a small Seattle studio for photo, video, web
and brand. It is built on a Higgsfield website scaffold: a React 19 +
TanStack Start app, server-rendered, deployed as one Cloudflare Worker at
`townleycreative.higgsfield.app` until a custom domain is added.

The app lives in [`app/`](app). The design summary and build status are in
[`app/design-brief.md`](app/design-brief.md).

## Running it

```bash
cd app
bun install
bun run typecheck
bun run build      # dist/server/server.js (the Worker) + dist/client
```

Higgsfield's CI builds and ships every deploy, so a local build is only needed
to check your work.

## Where things live

| What | Where |
| --- | --- |
| Constants: email, Calendly, booking status, the reel | `app/src/site.ts` |
| Prices, tiers, bundles, retainers (one file) | `app/src/data/pricing.ts` |
| Work tiles (concept frames) | `app/src/data/work.ts`, images in `app/public/media/work/` |
| The reel (WebM + MP4) and its poster | `app/public/media/reel/` |
| Form backend: leads table, spam guards, email | `app/src/lib/leads.*.ts`, `app/migrations/0002_leads.sql` |
| Page title, description, favicon, link-preview image | `app/src/app-meta.json` |
| Styles (plain CSS on the brand tokens) | `app/src/styles/townley/` |
| Components (sign, nav, buttons, status sign, materials) | `app/src/components/townley/` |
| Pages | `app/src/routes/` |

## Constants to change

All in `app/src/site.ts`. While a value is still a placeholder, the site hides
or falls back for it rather than showing a broken link.

- `CONTACT_EMAIL`: the public agency address (placeholder `hello@[domain]`).
- `CALENDLY_URL`: the 15-minute consult (empty for now; "Book a 15-min call"
  points at the contact section until it is set).
- `BOOKING_STATUS`: the OPEN sign text. Update it each quarter, or when booked
  out (currently "Open — booking Q4 2026").

## Leads and email

Quote requests (`/quote`) and brand-audit requests (`/audit`, and the form on
the home page) are saved to the site's database in a `leads` table, tagged
`TC-quote` or `TC-audit`. To also get each lead by email, with an automatic
reply to the sender, add these secrets in the Higgsfield website settings and
redeploy:

- `RESEND_API_KEY`: an API key from Resend, with the agency domain verified.
- `LEADS_FROM_EMAIL` (optional): the sender, e.g. `Townley Creative <hello@yourdomain.com>`.
  Defaults to `CONTACT_EMAIL`.

Email only switches on once `CONTACT_EMAIL` is a real address. Spam guards: a
hidden honeypot field, a minimum time on the form, and at most five
submissions per visitor every ten minutes.

## Replacing the concept media

- **Work tiles:** each tile needs `<key>-log-720/1280.webp` and
  `<key>-grade-720/1280.webp` (the ungraded and graded frame, same framing)
  in `app/public/media/work/`; set `concept: false` in `app/src/data/work.ts`.
- **Reel:** replace `reel.webm` and `reel.mp4`, update `runtime`, and set
  `isConcept: false` (and `hasAudio: true` if it has sound) in `REEL` in
  `app/src/site.ts`.

## Notes

- `.github/workflows/ci.yml` came with the scaffold and targets Higgsfield's
  own runners (`arc-runners-frontend`). GitHub has no such runner, so its runs
  sit queued there. Higgsfield's deploy CI is separate and unaffected.
