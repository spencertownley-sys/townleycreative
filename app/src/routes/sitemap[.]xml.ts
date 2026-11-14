import { createFileRoute } from '@tanstack/react-router'

// Update this date when page content changes; a lastmod that changes daily
// without content changes teaches search engines to ignore it.
const LAST_MODIFIED = '2026-11-14'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin
        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <url>',
          `    <loc>${origin}/</loc>`,
          `    <lastmod>${LAST_MODIFIED}</lastmod>`,
          '    <changefreq>weekly</changefreq>',
          '    <priority>1.0</priority>',
          '  </url>',
          '  <url>',
          `    <loc>${origin}/privacy</loc>`,
          `    <lastmod>${LAST_MODIFIED}</lastmod>`,
          '    <changefreq>yearly</changefreq>',
          '    <priority>0.3</priority>',
          '  </url>',
          '</urlset>',
        ].join('\n')
        return new Response(xml, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
