import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { submitAudit } from "../../../lib/leads.functions";
import { TubeButton } from "../TubeButton";
import { EMAIL_RE, FORM_ERROR, Field, RATE_LIMITED, Trap, inputProps } from "./fields";

type Errors = Partial<Record<"site" | "handle" | "email" | "form", string>>;

/** Free brand audit intake: site, handle, email, and one optional line. */
export function AuditForm() {
  const navigate = useNavigate();
  const started = useRef(0);
  const [site, setSite] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);

  useEffect(() => {
    started.current = performance.now();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (site.trim().length < 3)
      next.site = "Add your website, or a link to wherever you live online.";
    if (!handle.trim()) next.handle = "Add your Instagram or other handle.";
    if (!EMAIL_RE.test(email.trim())) next.email = "That email doesn’t look right.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSending(true);
    try {
      const result = await submitAudit({
        data: {
          site,
          handle,
          email: email.trim(),
          note,
          trap,
          elapsedMs: performance.now() - started.current,
        },
      });
      if (result.ok) {
        await navigate({ to: "/thanks", search: { from: "audit" } });
        return;
      }
      setErrors({ form: result.error === "rate_limited" ? RATE_LIMITED : FORM_ERROR });
    } catch {
      setErrors({ form: FORM_ERROR });
    }
    setSending(false);
  };

  return (
    <form className="tc-form tc-audit-form" onSubmit={onSubmit} noValidate>
      <Field label="Website" error={errors.site}>
        {(ids) => (
          <input
            {...inputProps(ids, {
              type: "url",
              inputMode: "url",
              autoComplete: "url",
              placeholder: "yourbusiness.com",
              value: site,
              onChange: (e) => setSite(e.currentTarget.value),
            })}
          />
        )}
      </Field>
      <Field label="Instagram or other handle" error={errors.handle}>
        {(ids) => (
          <input
            {...inputProps(ids, {
              type: "text",
              autoCapitalize: "off",
              placeholder: "@yourbusiness",
              value: handle,
              onChange: (e) => setHandle(e.currentTarget.value),
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
      <Field
        label="What’s bugging you most?"
        optional
        hint={`${140 - note.length} characters left`}
      >
        {(ids) => (
          <input
            {...inputProps(ids, {
              type: "text",
              maxLength: 140,
              value: note,
              onChange: (e) => setNote(e.currentTarget.value),
            })}
          />
        )}
      </Field>
      <Trap value={trap} onChange={setTrap} />
      <div className="tc-form__actions">
        <TubeButton variant="fill" type="submit" disabled={sending}>
          {sending ? "Sending…" : "Request the free audit"}
        </TubeButton>
        <p className="tc-form__error" role="alert">
          {errors.form ?? ""}
        </p>
      </div>
    </form>
  );
}
