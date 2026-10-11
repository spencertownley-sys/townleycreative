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
| Constants: email, Calendly, booking status | `app/src/site.ts` |
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

## Notes

- `.github/workflows/ci.yml` came with the scaffold and targets Higgsfield's
  own runners (`arc-runners-frontend`). GitHub has no such runner, so its runs
  sit queued there. Higgsfield's deploy CI is separate and unaffected.
