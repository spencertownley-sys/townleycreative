import { clsx } from "clsx";
import { useId, type InputHTMLAttributes, type ReactNode } from "react";

/** Form-level error copy (PRD tab 3, microcopy). */
export const FORM_ERROR = "That one didn’t go through — try again or email us.";
export const RATE_LIMITED = "That’s a few in a row from here. Give it ten minutes, or email us.";

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
  className?: string;
};

/** A visible label, the control, and an inline error tied to it. */
export function Field({ label, hint, error, optional, children, className }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={clsx("tc-field", className)}>
      <label className="tc-field__label" htmlFor={id}>
        {label}
        {optional ? <span className="tc-field__optional"> (optional)</span> : null}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {hint ? (
        <p id={hintId} className="tc-field__hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="tc-field__error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type ChipGroupProps<T extends string> = {
  legend: string;
  options: readonly T[];
  value: T[];
  onChange: (next: T[]) => void;
  multiple?: boolean;
  error?: string;
  name: string;
};

/** Chips are real checkboxes (or radios) under the hood. */
export function ChipGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
  multiple = false,
  error,
  name,
}: ChipGroupProps<T>) {
  const id = useId();
  return (
    <fieldset
      className="tc-chips"
      aria-describedby={error ? `${id}-error` : undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend className="tc-field__label">{legend}</legend>
      <div className="tc-chips__list">
        {options.map((opt) => {
          const checked = value.includes(opt);
          return (
            <label key={opt} className="tc-chip">
              <input
                type={multiple ? "checkbox" : "radio"}
                name={name}
                value={opt}
                checked={checked}
                onChange={() => {
                  if (!multiple) onChange([opt]);
                  else onChange(checked ? value.filter((v) => v !== opt) : [...value, opt]);
                }}
              />
              <span>{opt}</span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p id={`${id}-error`} className="tc-field__error">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

/** Off-screen field that people never see or fill; bots usually do. */
export function Trap({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="tc-trap" aria-hidden="true">
      <label>
        Leave this empty
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
        />
      </label>
    </div>
  );
}

export function inputProps(
  ids: { id: string; describedBy?: string; invalid: boolean },
  rest: InputHTMLAttributes<HTMLInputElement> = {},
): InputHTMLAttributes<HTMLInputElement> {
  return {
    id: ids.id,
    "aria-describedby": ids.describedBy,
    "aria-invalid": ids.invalid || undefined,
    className: "tc-input",
    ...rest,
  };
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
