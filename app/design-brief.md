# Townley Creative — design brief

The working summary of the approved "Townley Creative — PRD Set" (six tabs:
brand, visual identity, site and content, sales funnels, pricing, build).
When this file and the PRD disagree, the PRD wins; update this file.

- **Design read:** a small Seattle studio, "the night shift," for the
  businesses that keep the lights on late. Moody, local, calm, a little dry.
- **Concept spine:** a neon sign on a wet Seattle alley wall at 1 a.m.
  (approved hero concept A, "Open Late"). The sign is the logo, the hero and
  the recurring motif. Section headers reuse it as lit tube words.
- **Delivery tier:** editorial. Light behaving like light (strike, flicker,
  glow-in); nothing slides, bounces or parallaxes.
- **Animation mode: non-animated** (the owner's choice in the PRD: "non-animated
  Higgsfield scaffold, CSS motion, no feed publish").
- **Locked palette (owner's brand colors):** ground #0B0A0C, wall #17171A,
  steel #2A2F33, leather #1C1715, tube #3D6CFF, word #39FF14, word core
  #F4FFE9, caps core #DCFFD0, text #E3E6E4, text-dim #8F959A, text-faint
  #55595E, alert #FF3B3B (form errors only). Green appears at most three times
  per viewport.
- **Locked type:** Mr Dafoe (the sign's script and the Tc mark only), Oswald
  (display caps, always uppercase), Barlow (body), IBM Plex Mono (prices,
  meta, form labels). Google Fonts, `display=swap`.
- **Textures:** brick, wet asphalt, reflections, metal, leather, dirt; one
  material per section plus the page grain. CSS and inline SVG only.
- **Section plan (one long page):** Hero, Statement, Services, Work, Process,
  Pricing, Studio, Brand audit, Contact/footer. Utility routes: `/quote`,
  `/audit`, `/thanks`, `/privacy`.
- **Asset plan:** the sign, mark and OG image are drawn in CSS (never
  photographed). Work tiles and the studio photo are Higgsfield concept
  frames in the house grade, each captioned "concept frame".
- **CTA inventory:** Book a 15-min call (green fill), Get a quote (blue
  outline), Request the free audit, Email us, the OPEN sign.

## Build status

| Step (PRD tab 6) | State |
| --- | --- |
| 1 Intake, 2 Repo | Done |
| 3 Foundation: tokens, fonts, grain, vignette, materials, metal bar, `site.ts` | Done |
| 4 The sign: `NeonSign`, `StatusSign`, `Nav`, hero with reflection and flicker | Done |
| 5 Copy sections: Statement, Process, Studio, Contact/footer | Done |
| 6 Services + Pricing from one price file | Done |
| 7 Placeholders: six concept frames, studio image, concept reel | Done |
| 8 Funnels: quote form, audit form, `/thanks`, leads table, optional email | Done; Calendly and email wait on open items |
| 9 Analytics + SEO | Partly: titles, sitemap, LocalBusiness schema; no analytics yet |
| 10 Hardening, 11 Hand-off | Not started |

Added on request: reel theatre mode ("Lights down") and grade-wipe work tiles
(LOG at rest; hover or drag wipes the grade across).
