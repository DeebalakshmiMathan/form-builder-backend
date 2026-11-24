/**
 * Validates a submission payload against a stored form definition.
 * Pure function (no I/O) -> trivially unit-testable and reusable.
 * Unknown keys are dropped; only keys defined in the form are persisted.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9][0-9\s-]{6,14}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}/;

// eslint-disable-next-line no-control-regex
const clean = (s) => s.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/<[^>]*>/g, '').trim();
const isEmpty = (v) => v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
const fail = (error) => ({ error });
const ok = (value) => ({ value });

function lengthCheck(str, f, defMax) {
  const { minLength, maxLength } = f.validation || {};
  if (minLength != null && str.length < minLength) return fail(`${f.label} must be at least ${minLength} characters`);
  if (str.length > (maxLength ?? defMax)) return fail(`${f.label} must be at most ${maxLength ?? defMax} characters`);
  return null;
}

const textLike = (defMax) => (raw, f) => {
  if (typeof raw !== 'string') return fail(`${f.label} must be text`);
  return lengthCheck(raw, f, defMax) || ok(raw);
};

const validators = {
  text: textLike(1000),
  textarea: textLike(5000),
  email: (raw, f) => {
    if (typeof raw !== 'string' || !EMAIL_RE.test(raw) || raw.length > 254) return fail(`${f.label} must be a valid email`);
    return ok(raw.toLowerCase());
  },
  phone: (raw, f) =>
    typeof raw === 'string' && PHONE_RE.test(raw) ? ok(raw) : fail(`${f.label} must be a valid phone number`),
  number: (raw, f) => {
    const n = typeof raw === 'number' ? raw : typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : NaN;
    if (!Number.isFinite(n)) return fail(`${f.label} must be a number`);
    const { min, max } = f.validation || {};
    if (min != null && n < min) return fail(`${f.label} must be at least ${min}`);
    if (max != null && n > max) return fail(`${f.label} must be at most ${max}`);
    return ok(n);
  },
  date: (raw, f) =>
    typeof raw === 'string' && DATE_RE.test(raw) && !Number.isNaN(Date.parse(raw))
      ? ok(raw)
      : fail(`${f.label} must be a valid date (YYYY-MM-DD)`),
  select: (raw, f) => (typeof raw === 'string' && f.options.includes(raw) ? ok(raw) : fail(`${f.label} has an invalid option`)),
  radio: (raw, f) => (typeof raw === 'string' && f.options.includes(raw) ? ok(raw) : fail(`${f.label} has an invalid option`)),
  checkbox: (raw, f) => {
    // Single boolean checkbox (no options) or multi-select group (with options)
    if (!f.options?.length) {
      if (typeof raw !== 'boolean') return fail(`${f.label} must be true or false`);
      return f.required && !raw ? fail(`${f.label} is required`) : ok(raw);
    }
    if (!Array.isArray(raw)) return fail(`${f.label} must be a list`);
    const unique = [...new Set(raw.map(String))];
    return unique.every((v) => f.options.includes(v)) ? ok(unique) : fail(`${f.label} has an invalid option`);
  },
};

export function validateSubmission(fields, payload) {
  const input = payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : {};
  const errors = {};
  const data = {};

  for (const f of fields) {
    let raw = input[f.key];
    if (typeof raw === 'string') raw = clean(raw);

    if (isEmpty(raw)) {
      if (f.required) errors[f.key] = `${f.label} is required`;
      continue;
    }
    const result = validators[f.type](raw, f);
    if (result.error) errors[f.key] = result.error;
    else data[f.key] = result.value;
  }
  return { isValid: Object.keys(errors).length === 0, errors, data };
}
