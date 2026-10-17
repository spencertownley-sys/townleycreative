import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportHiggsfieldError } from "../lib/higgsfield-error-reporting";
// Page metadata (browser <title>/favicon + social og: tags) committed into the
// repo by the marketplace meta API and read at BUILD time — no runtime fetch.
// Editing it via the app settings UI rewrites this file and redeploys the app.
import appMetaJson from "../app-meta.json";
import { GrainOverlay, Vignette } from "../components/townley/Atmosphere";
import { Footer } from "../components/townley/Footer";
import { Nav } from "../components/townley/Nav";
import { TubeButton } from "../components/townley/TubeButton";
import { FONT_STYLESHEET, SITE_NAME, SITE_TITLE, TAGLINE, emailHref } from "../site";

declare const __HF_DESIGN_INSPECTOR__: boolean;

// Built-in defaults for any field that isn't set in app-meta.json.
const DEFAULT_TITLE = SITE_TITLE;
const DEFAULT_DESCRIPTION = TAGLINE;

type AppMeta = {
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  favicon_url?: string | null;
  og_video_url?: string | null;
};

const appMeta = appMetaJson as AppMeta;

// The sign strikes on page load once per browser session. This runs before
// first paint: on a repeat view it marks <html data-lit> so sign.css skips the
// strike; on the first view it records the visit.
const SIGN_SESSION_SCRIPT =
  "(function(){try{var k='tc-lit';if(sessionStorage.getItem(k)){document.documentElement.setAttribute('data-lit','')}else{sessionStorage.setItem(k,'1')}}catch(e){}})();";

// favicon/og images live in THIS app's own /assets, so the host is never
// inherent. app-meta.json may carry an absolute higgsfield-app URL with a STALE
// host — baked from the app this one was copied/remixed/renamed from — which would
// serve the wrong app's favicon/og. Strip any higgsfield-app host (prod
// higgsfield.app + dev higgsfield-dev.app) down to a root-relative path so it
// always resolves against whoever serves THIS page (preview / prod / custom
// domain). Genuinely external URLs (a CDN image the owner set) are left absolute.
const APP_HOST_ZONES = ["higgsfield.app", "higgsfield-dev.app"];

function toOwnAssetUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("/")) return value; // already root-relative
  try {
    const u = new URL(value);
    const isAppHost = APP_HOST_ZONES.some(
      (zone) => u.hostname === zone || u.hostname.endsWith(`.${zone}`),
    );
    if (isAppHost) return u.pathname + u.search;
    return value; // external host (CDN, etc.) — keep absolute
  } catch {
    return value; // not a parseable URL — leave as-is
  }
}

// Build the document head (title / description / og: / twitter: / favicon) from
// app-meta.json, falling back to the defaults above for any unset field.
function buildHead(meta: AppMeta) {
  const title = meta.og_title ?? DEFAULT_TITLE;
  const description = meta.og_description ?? DEFAULT_DESCRIPTION;
  const ogImage = toOwnAssetUrl(meta.og_image_url);
  const favicon = toOwnAssetUrl(meta.favicon_url);
  const ogVideo = toOwnAssetUrl(meta.og_video_url);

  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title },
      { name: "description", content: description },
      { name: "author", content: SITE_NAME },
      { name: "theme-color", content: "#0b0a0c" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: ogImage ? "summary_large_image" : "summary" },
      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
            { name: "twitter:image", content: ogImage },
          ]
        : []),
      ...(ogVideo ? [{ property: "og:video", content: ogVideo }] : []),
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      { rel: "stylesheet", href: FONT_STYLESHEET },
      { rel: "stylesheet", href: appCss },
      ...(favicon ? [{ rel: "icon", type: "image/png", href: favicon }] : []),
      { rel: "apple-touch-icon", href: "/assets/apple-touch-icon.png" },
    ],
  };
}

function NotFoundComponent() {
  const email = emailHref();
  return (
    <main id="main" className="tc-lost tc-mat tc-mat-dirt">
      <div className="tc-lost__sign" aria-hidden="true">
        <span className="tc-lost__code">404</span>
      </div>
      <h1 className="tc-lost__title">Nothing&rsquo;s lit back here.</h1>
      <div className="tc-lost__actions">
        <TubeButton variant="outline" href="/">
          Back to the front
        </TubeButton>
        {email ? (
          <TubeButton variant="text" href={email}>
            Email us
          </TubeButton>
        ) : null}
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportHiggsfieldError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <main id="main" className="tc-lost tc-mat tc-mat-dirt">
      <div className="tc-lost__sign" aria-hidden="true">
        <span className="tc-lost__code">500</span>
      </div>
      <h1 className="tc-lost__title">This page didn&rsquo;t load.</h1>
      <p className="tc-lost__copy">
        Something on our end went dark. Try again, or head back to the front.
      </p>
      <div className="tc-lost__actions">
        <TubeButton
          variant="fill"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Try again
        </TubeButton>
        <TubeButton variant="outline" href="/">
          Back to the front
        </TubeButton>
      </div>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // Read the committed page metadata at build time (no runtime fetch).
  head: () => buildHead(appMeta),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    // data-lit is set before hydration by SIGN_SESSION_SCRIPT, hence the
    // hydration warning suppression on <html>.
    <html
      lang="en"
      data-theme="default-dark"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      {/* Permanently dark: data-theme is pinned on <html> above. Do not add a
          theme toggle or a light mode. */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: SIGN_SESSION_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="tc-body">
        {children}
        <Vignette />
        <GrainOverlay />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if (!__HF_DESIGN_INSPECTOR__) {
      return;
    }

    void import("../module/design-inspector/runtime")
      .then(({ installHiggsfieldDesignInspector }) => {
        installHiggsfieldDesignInspector();
      })
      .catch((error) => {
        reportHiggsfieldError(
          error instanceof Error ? error : new Error("Failed to load design inspector"),
          {
            boundary: "higgsfield_design_inspector_import",
          },
        );
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <a className="tc-skip" href="#main">
        Skip to content
      </a>
      <Nav />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Footer />
    </QueryClientProvider>
  );
}
