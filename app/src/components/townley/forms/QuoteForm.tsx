import { useNavigate } from "@tanstack/react-router";
import { clsx } from "clsx";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { QUOTE_SERVICES, type QuoteService } from "../../../data/pricing";
import { submitQuote } from "../../../lib/leads.functions";
import { BUDGETS, SEGMENTS, SOURCES, TIMELINES } from "../../../site";
import { TubeButton } from "../TubeButton";
import { ChipGroup, EMAIL_RE, FORM_ERROR, Field, RATE_LIMITED, Trap, inputProps } from "./fields";

type Budget = (typeof BUDGETS)[number];
type Timeline = (typeof TIMELINES)[number];
type Segment = (typeof SEGMENTS)[number];
type Source = (typeof SOURCES)[number];

export type QuotePrefill = {
  services: QuoteService[];
  tier?: string;
  bundle?: string;
  /** Human label for what the visitor clicked, e.g. "Photography, Core". */
  context?: string;
};

const STEPS = ["What", "Scope", "About", "You"] as const;

type Errors = Partial<
  Record<
    | "services"
    | "budget"
    | "timeline"
    | "hardDate"
    | "business"
    | "brief"
    | "name"
    | "email"
    | "form",
    string
  >
>;

/** The four-step quote request (PRD tab 4): under 90 seconds, one group per step. */
export function QuoteForm({ prefill }: { prefill: QuotePrefill }) {
  const navigate = useNavigate();
  const started = useRef(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<QuoteService[]>(prefill.services);
  const [budget, setBudget] = useState<Budget[]>([]);
  const [timeline, setTimeline] = useState<Timeline[]>([]);
  const [hardDate, setHardDate] = useState("");
  const [business, setBusiness] = useState("");
  const [segment, setSegment] = useState<Segment | "">("");
  const [link, setLink] = useState("");
  const [brief, setBrief] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState<Source | "">("");
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const moved = useRef(false);

  useEffect(() => {
    started.current = performance.now();
  }, []);

  // Move focus to the step heading when the step changes (not on first render).
  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
    moved.current = true;
  }, [step]);

  const validate = (s: number): Errors => {
    const e: Errors = {};
    if (s === 0 && services.length === 0) e.services = "Pick at least one.";
    if (s === 1) {
      if (!budget.length) e.budget = "Pick a range, or let us tell you what it costs.";
      if (!timeline.length) e.timeline = "Pick a timeline.";
      if (timeline[0] === "Hard date" && !hardDate) e.hardDate = "Add the date.";
    }
    if (s === 2) {
      if (!business.trim()) e.business = "Add your business name.";
      if (!brief.trim()) e.brief = "A line or two is plenty.";
    }
    if (s === 3) {
      if (!name.trim()) e.name = "Add your name.";
      if (!EMAIL_RE.test(email.trim())) e.email = "That email doesn’t look right.";
    }
    return e;
  };

  const next = () => {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length === 0) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (step < STEPS.length - 1) {
      next();
      return;
    }
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) return;

    setSending(true);
    try {
      const result = await submitQuote({
        data: {
          services,
          tier: prefill.tier,
          bundle: prefill.bundle,
          budget: budget[0],
          timeline: timeline[0],
          hardDate: timeline[0] === "Hard date" ? hardDate : undefined,
          business,
          segment: segment || undefined,
          link,
          brief,
          name,
          email: email.trim(),
          phone,
          source: source || undefined,
          trap,
          elapsedMs: performance.now() - started.current,
        },
      });
      if (result.ok) {
        await navigate({ to: "/thanks", search: { from: "quote" } });
        return;
      }
      setErrors({ form: result.error === "rate_limited" ? RATE_LIMITED : FORM_ERROR });
    } catch {
      setErrors({ form: FORM_ERROR });
    }
    setSending(false);
  };

  return (
    <form className="tc-form tc-quote" onSubmit={onSubmit} noValidate>
      <ol className="tc-progress" aria-label="Progress">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={clsx("tc-progress__seg", i <= step && "is-on")}
            aria-current={i === step ? "step" : undefined}
          >
            <span className="tc-sr-only">
              Step {i + 1}: {label}
              {i < step ? " (done)" : ""}
            </span>
          </li>
        ))}
      </ol>
      <h2 ref={headingRef} tabIndex={-1} className="tc-quote__step">
        <span className="tc-mono">{String(step + 1).padStart(2, "0")} / 04</span> {STEPS[step]}
      </h2>

      {step === 0 ? (
        <div className="tc-quote__body">
          {prefill.context ? (
            <p className="tc-quote__context">Starting from: {prefill.context}</p>
          ) : null}
          <ChipGroup
            legend="What do you need?"
            name="services"
            multiple
            options={QUOTE_SERVICES}
            value={services}
            onChange={setServices}
            error={errors.services}
          />
          <p className="tc-field__hint">
            Some of our concept imagery is generated, and we label it. You can opt out of generated
            imagery in your brief.
          </p>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="tc-quote__body">
          <ChipGroup
            legend="Budget"
            name="budget"
            options={BUDGETS}
            value={budget}
            onChange={setBudget}
            error={errors.budget}
          />
          <ChipGroup
            legend="Timeline"
            name="timeline"
            options={TIMELINES}
            value={timeline}
            onChange={setTimeline}
            error={errors.timeline}
          />
          {timeline[0] === "Hard date" ? (
            <Field label="The date" error={errors.hardDate}>
              {(ids) => (
                <input
                  {...inputProps(ids, {
                    type: "date",
                    value: hardDate,
                    onChange: (e) => setHardDate(e.currentTarget.value),
                  })}
                />
              )}
            </Field>
          ) : null}
        </div>
      ) : null}

      {step === 2 ? (
        <div className="tc-quote__body tc-form__grid">
          <Field label="Business name" error={errors.business}>
            {(ids) => (
              <input
                {...inputProps(ids, {
                  type: "text",
                  autoComplete: "organization",
                  value: business,
                  onChange: (e) => setBusiness(e.currentTarget.value),
                })}
              />
            )}
          </Field>
          <Field label="What kind of business" optional>
            {(ids) => (
              <select
                id={ids.id}
                className="tc-input tc-select"
                value={segment}
                onChange={(e) => setSegment(e.currentTarget.value as Segment | "")}
              >
                <option value="">Choose one</option>
                {SEGMENTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Website or Instagram" optional className="tc-form__wide">
            {(ids) => (
              <input
                {...inputProps(ids, {
                  type: "text",
                  inputMode: "url",
                  value: link,
                  onChange: (e) => setLink(e.currentTarget.value),
                })}
              />
            )}
          </Field>
          <Field
            label="What are we making, and why now?"
            error={errors.brief}
            hint={`${600 - brief.length} characters left`}
            className="tc-form__wide"
          >
            {(ids) => (
              <textarea
                id={ids.id}
                aria-describedby={ids.describedBy}
                aria-invalid={ids.invalid || undefined}
                className="tc-input tc-textarea"
                rows={5}
                maxLength={600}
                value={brief}
                onChange={(e) => setBrief(e.currentTarget.value)}
              />
            )}
          </Field>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="tc-quote__body tc-form__grid">
          <Field label="Your name" error={errors.name}>
            {(ids) => (
              <input
                {...inputProps(ids, {
                  type: "text",
                  autoComplete: "name",
                  value: name,
                  onChange: (e) => setName(e.currentTarget.value),
                })}
              />
            )}
          </Field>
          <Field label="Email" error={errors.email}>
            {(ids) => (
              <input
                {...inputProps(ids, {
                  type: "email",
                  autoComplete: "email",
                  value: email,
                  onChange: (e) => setEmail(e.currentTarget.value),
                })}
              />
            )}
          </Field>
          <Field label="Phone" optional>
            {(ids) => (
              <input
                {...inputProps(ids, {
                  type: "tel",
                  autoComplete: "tel",
                  value: phone,
                  onChange: (e) => setPhone(e.currentTarget.value),
                })}
              />
            )}
          </Field>
          <Field label="How did you find us" optional>
            {(ids) => (
              <select
                id={ids.id}
                className="tc-input tc-select"
                value={source}
                onChange={(e) => setSource(e.currentTarget.value as Source | "")}
              >
                <option value="">Choose one</option>
                {SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Trap value={trap} onChange={setTrap} />
        </div>
      ) : null}

      <div className="tc-form__actions">
        {step > 0 ? (
          <TubeButton variant="text" onClick={() => setStep((s) => Math.max(0, s - 1))}>
            Back
          </TubeButton>
        ) : null}
        {step < STEPS.length - 1 ? (
          <TubeButton variant="outline" type="submit">
            Next
          </TubeButton>
        ) : (
          <TubeButton variant="fill" type="submit" disabled={sending}>
            {sending ? "Sending…" : "Get a quote"}
          </TubeButton>
        )}
        <p className="tc-form__error" role="alert">
          {errors.form ?? ""}
        </p>
      </div>
    </form>
  );
}
