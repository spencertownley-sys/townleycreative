import { createFileRoute } from "@tanstack/react-router";

import { StructuredData } from "../components/StructuredData";
import { Hero } from "../components/townley/Hero";
import { ReelProvider } from "../components/townley/Reel";
import { Audit } from "../components/townley/sections/Audit";
import { Pricing } from "../components/townley/sections/Pricing";
import { Process } from "../components/townley/sections/Process";
import { Services } from "../components/townley/sections/Services";
import { Statement } from "../components/townley/sections/Statement";
import { Studio } from "../components/townley/sections/Studio";
import { Work } from "../components/townley/sections/Work";
import { SITE_NAME, TAGLINE } from "../site";

// LocalBusiness schema (PRD tab 3, SEO basics). Add "url" once a domain exists.
const BUSINESS_JSON = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE_NAME,
  description: TAGLINE,
  areaServed: [
    { "@type": "City", name: "Seattle" },
    { "@type": "City", name: "Tacoma" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Seattle",
    addressRegion: "WA",
    addressCountry: "US",
  },
  priceRange: "$$",
  knowsAbout: ["Photography", "Video production", "Web design", "Brand identity", "UI/UX design"],
});

export const Route = createFileRoute("/")({
  // No title/description here on purpose: the home page inherits the app's
  // editable page metadata from the root route (set via the marketplace meta
  // API — title/favicon/og), so a shared link to "/" shows the owner's values.
  // Add a `head` here only to give a SPECIFIC page its own title/description
  // (a deeper route's head overrides the root's for that page).
  component: Index,
});

// Routes are server-rendered — keep render SSR-safe (no window/document at
// module top level or during render). See ./README.md.
function Index() {
  return (
    <ReelProvider>
      <StructuredData json={BUSINESS_JSON} />
      <main id="main">
        <Hero />
        <Statement />
        <Services />
        <Work />
        <Process />
        <Pricing />
        <Studio />
        <Audit />
      </main>
    </ReelProvider>
  );
}
