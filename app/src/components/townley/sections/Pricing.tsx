import { useState } from "react";

import {
  LAUNCH_KIT,
  POLICY_LINES,
  RETAINERS,
  SERVICES,
  type Service,
  type TierId,
} from "../../../data/pricing";
import { QUOTE_HREF } from "../../../site";
import { TubeButton } from "../TubeButton";
import { TubeHeading } from "../TubeHeading";

function PricingCard({ service }: { service: Service }) {
  const [tierId, setTierId] = useState<TierId>("core");
  const tier = service.tiers.find((t) => t.id === tierId) ?? service.tiers[1];

  return (
    <li className="tc-price-card tc-mat-leather">
      <h3 className="tc-price-card__name">{service.name}</h3>
      <p className="tc-price-card__line">{service.line}</p>

      <fieldset className="tc-tiers">
        <legend className="tc-sr-only">{service.name} tier</legend>
        {service.tiers.map((t) => (
          <label key={t.id} className="tc-tiers__opt">
            <input
              type="radio"
              name={`tier-${service.key}`}
              value={t.id}
              checked={tierId === t.id}
              onChange={() => setTierId(t.id)}
            />
            <span>{t.label}</span>
          </label>
        ))}
      </fieldset>

      <div className="tc-price-card__tier" aria-live="polite">
        {tierId === "core" ? <span className="tc-price-card__flag">Most booked</span> : null}
        <p className="tc-price-card__deliverable">{tier.deliverable}</p>
        <p className="tc-price-card__price">
          <span className="tc-price-card__from">{tierId === "starter" ? "from" : ""}</span>
          {tier.price}
        </p>
        <p className="tc-price-card__turn">{tier.turnaround}</p>
      </div>
      {service.note ? <p className="tc-price-card__note">{service.note}</p> : null}

      <TubeButton
        variant="outline"
        className="tc-price-card__cta"
        href={`${QUOTE_HREF}?service=${service.key}&tier=${tierId}`}
      >
        Get a quote
      </TubeButton>
    </li>
  );
}

/** Section 6: the Launch Kit anchor, nine service cards with tiers, retainers, policy. */
export function Pricing() {
  return (
    <section
      id="pricing"
      className="tc-section tc-mat tc-mat-ground tc-pricing"
      aria-labelledby="pricing-h"
    >
      <div className="tc-wrap">
        <header className="tc-section__head">
          <TubeHeading id="pricing-h">What it costs</TubeHeading>
          <p className="tc-lead">Starting prices, in the open. Final quotes in 24 hours.</p>
        </header>

        <article className="tc-launch tc-mat-leather">
          <div className="tc-launch__text">
            <p className="tc-label">The anchor</p>
            <h3 className="tc-launch__name">{LAUNCH_KIT.name}</h3>
            <p className="tc-launch__who">{LAUNCH_KIT.forWho}</p>
            <ul className="tc-launch__list">
              {LAUNCH_KIT.contents.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div className="tc-launch__buy">
            <p className="tc-launch__price">{LAUNCH_KIT.price}</p>
            <p className="tc-launch__fine">One team, one invoice, one date on the calendar.</p>
            <TubeButton variant="fill" href={`${QUOTE_HREF}?bundle=${LAUNCH_KIT.key}`}>
              Get a quote
            </TubeButton>
          </div>
        </article>

        <ul className="tc-price-grid">
          {SERVICES.map((s) => (
            <PricingCard key={s.key} service={s} />
          ))}
        </ul>

        <div className="tc-retainers tc-mat-metal">
          <p className="tc-label tc-retainers__label">Monthly</p>
          <ul className="tc-retainers__list">
            {RETAINERS.map((r) => (
              <li key={r.key} className="tc-retainer">
                <div>
                  <h3 className="tc-retainer__name">{r.name}</h3>
                  <p className="tc-retainer__line">{r.line}</p>
                </div>
                <div className="tc-retainer__buy">
                  <p className="tc-retainer__price">{r.price}</p>
                  <p className="tc-retainer__term">{r.term}</p>
                  <a className="tc-panel__link" href={`${QUOTE_HREF}?service=${r.key}`}>
                    Get a quote
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <ul className="tc-policy">
          {POLICY_LINES.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
