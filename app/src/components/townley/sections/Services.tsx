import { RETAINERS, SEGMENT_BUNDLES, SERVICES, type ServiceGroup } from "../../../data/pricing";
import { PRICING_HREF, QUOTE_HREF } from "../../../site";
import { MetalBar } from "../MaterialSection";
import { TubeHeading } from "../TubeHeading";

const GROUPS: { key: ServiceGroup; name: string }[] = [
  { key: "capture", name: "Capture" },
  { key: "build", name: "Build" },
  { key: "design", name: "Design" },
];

function PanelPlate({ name, count }: { name: string; count: number }) {
  return (
    <div className="tc-panel__plate tc-mat-metal">
      <span className="tc-panel__bolt" aria-hidden="true" />
      <h3 className="tc-panel__name">{name}</h3>
      <span className="tc-panel__count tc-mono" aria-hidden="true">
        {String(count).padStart(2, "0")}
      </span>
      <span className="tc-panel__bolt" aria-hidden="true" />
    </div>
  );
}

/** Section 3: four metal-framed panels, each service with a starting price and turnaround. */
export function Services() {
  return (
    <section
      id="services"
      className="tc-section tc-mat tc-mat-dirt tc-services"
      aria-labelledby="services-h"
    >
      <MetalBar className="tc-section__bar" thickness={8} />
      <div className="tc-wrap">
        <header className="tc-section__head">
          <TubeHeading id="services-h">What we make</TubeHeading>
          <p className="tc-lead">Pick one thing or hand us the whole launch.</p>
        </header>

        <div className="tc-panels">
          {GROUPS.map((group) => {
            const items = SERVICES.filter((s) => s.group === group.key);
            return (
              <article key={group.key} className="tc-panel">
                <PanelPlate name={group.name} count={items.length} />
                <ul className="tc-panel__list">
                  {items.map((s) => (
                    <li key={s.key} className="tc-service">
                      <div className="tc-service__text">
                        <h4 className="tc-service__name">{s.name}</h4>
                        <p className="tc-service__line">{s.line}</p>
                      </div>
                      <div className="tc-service__meta">
                        <span className="tc-service__price">from {s.tiers[0].price}</span>
                        <span className="tc-service__turn">{s.tiers[0].turnaround}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <a className="tc-panel__link" href={PRICING_HREF}>
                  See pricing
                </a>
              </article>
            );
          })}

          <article className="tc-panel">
            <PanelPlate name="Ongoing" count={RETAINERS.length} />
            <ul className="tc-panel__list">
              {RETAINERS.map((r) => (
                <li key={r.key} className="tc-service">
                  <div className="tc-service__text">
                    <h4 className="tc-service__name">{r.name}</h4>
                    <p className="tc-service__line">{r.line}</p>
                  </div>
                  <div className="tc-service__meta">
                    <span className="tc-service__price">{r.price}</span>
                    <span className="tc-service__turn">{r.term}</span>
                  </div>
                </li>
              ))}
            </ul>
            <a className="tc-panel__link" href={PRICING_HREF}>
              See pricing
            </a>
          </article>
        </div>

        <div className="tc-bundles">
          <p className="tc-label">Bundles, by who's asking</p>
          <ul className="tc-bundles__list">
            {SEGMENT_BUNDLES.map((b) => (
              <li key={b.key} className="tc-bundle">
                <div className="tc-bundle__head">
                  <h4 className="tc-bundle__name">{b.name}</h4>
                  <span className="tc-bundle__price">{b.price}</span>
                </div>
                <p className="tc-bundle__who">{b.forWho}</p>
                <p className="tc-bundle__contents">{b.contents.join(" · ")}</p>
                <a className="tc-panel__link" href={`${QUOTE_HREF}?bundle=${b.key}`}>
                  Get a quote
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
