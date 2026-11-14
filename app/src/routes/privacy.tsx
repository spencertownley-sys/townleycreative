import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy | Townley Creative" },
      {
        name: "description",
        content: "How Townley Creative handles visitor data, cookies and hosting providers.",
      },
    ],
  }),
  component: Privacy,
});

const h2 = "mt-8 text-q-title-md-semi-bold text-q-text-primary";
const p = "mt-2 text-q-body-md-regular text-q-text-secondary";
const th = "border-b border-q-border-default px-3 py-2 text-left text-q-body-sm-semi-bold";
const td = "border-b border-q-border-default px-3 py-2 text-q-body-sm-regular";

function Privacy() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-q-title-lg-semi-bold text-q-text-primary">
        Privacy policy for Townley Creative
      </h1>
      <p className={p}>Last updated: 14 November 2026</p>

      <h2 className={h2}>Who is responsible</h2>
      <p className={p}>
        Townley Creative is run by [PLACEHOLDER: OWNER LEGAL NAME], [PLACEHOLDER: CITY, STATE,
        COUNTRY]. Contact: [PLACEHOLDER: CONTACT EMAIL].
      </p>

      <h2 className={h2}>What is collected and why</h2>
      <ul className="mt-2 list-disc pl-6 text-q-body-md-regular text-q-text-secondary">
        <li>
          This site has no forms, accounts or analytics, and its own code collects no personal data.
        </li>
        <li>
          Technical data: like every website, the hosting provider receives your IP address and
          browser details in order to deliver pages and keep the service secure.
        </li>
      </ul>
      <p className={p}>
        Legal bases under EU and UK law: providing the service you asked for (contract), keeping the
        site secure and working (legitimate interests), and your consent where this policy says
        something is optional.
      </p>

      <h2 className={h2}>Who it is shared with</h2>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={th}>Company</th>
              <th className={th}>What they do for this site</th>
              <th className={th}>Where</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={td}>Higgsfield</td>
              <td className={td}>Website builder and hosting</td>
              <td className={td}>[PLACEHOLDER: Higgsfield data location]</td>
            </tr>
            <tr>
              <td className={td}>Cloudflare</td>
              <td className={td}>Runs the Workers that serve the site and bot protection</td>
              <td className={td}>United States</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={p}>
        Personal information is not sold, and it is not shared for cross-context behavioural
        advertising.
      </p>

      <h2 className={h2}>International transfers</h2>
      <p className={p}>
        The companies above are mostly based in the United States. Where data leaves the EU or UK it
        is covered by the provider's standard contractual clauses or Data Privacy Framework
        certification.
      </p>

      <h2 className={h2}>How long it is kept</h2>
      <p className={p}>
        [PLACEHOLDER: state a retention period for each type of data, for example server logs for 30
        days]
      </p>

      <h2 className={h2}>Your rights</h2>
      <ul className="mt-2 list-disc pl-6 text-q-body-md-regular text-q-text-secondary">
        <li>
          EU and UK visitors: access, correction, deletion, restriction, objection, portability,
          withdrawing consent, and the right to complain to your data protection authority.
        </li>
        <li>
          California and other US state residents: the right to know, delete and correct, and to opt
          out of sale or sharing. This site does not sell or share personal information, and it
          honours Global Privacy Control signals.
        </li>
        <li>
          To use any of these rights, email [PLACEHOLDER: CONTACT EMAIL]. You will get an answer
          within 30 days. You will never be treated differently for using them.
        </li>
      </ul>

      <h2 className={h2}>Children</h2>
      <p className={p}>
        This site is not directed at children under 13 (under 16 in the EU and UK) and does not
        knowingly collect their data.
      </p>

      <h2 id="cookies" className={h2}>
        Cookies
      </h2>
      <p className={p}>
        This site sets no cookies of its own and stores nothing in your browser. Its hosting
        provider, Cloudflare, sets one strictly necessary bot-protection cookie, __cf_bm, which
        lasts 30 minutes. No consent is needed for it. No cookie-consent banner is shown because
        nothing optional is used, so there is no consent localStorage key. This section will be
        updated if analytics, embeds or forms are added.
      </p>

      <h2 className={h2}>Changes</h2>
      <p className={p}>
        If this policy changes in a way that matters, the date above changes and a notice is shown
        on the site.
      </p>

      <p className="mt-10">
        <Link to="/" className="text-q-body-sm-regular text-q-text-primary underline">
          Back to home
        </Link>
      </p>
    </main>
  );
}
