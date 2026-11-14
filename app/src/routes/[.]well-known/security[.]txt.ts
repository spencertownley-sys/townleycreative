import { createFileRoute } from "@tanstack/react-router";

// Update Expires at least once a year (RFC 9116).
const EXPIRES = "2027-11-14T00:00:00.000Z";

export const Route = createFileRoute("/.well-known/security.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const body = [
          "Contact: mailto:[PLACEHOLDER: CONTACT EMAIL]",
          `Expires: ${EXPIRES}`,
          "Preferred-Languages: en",
          `Canonical: ${origin}/.well-known/security.txt`,
        ].join("\n");
        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
