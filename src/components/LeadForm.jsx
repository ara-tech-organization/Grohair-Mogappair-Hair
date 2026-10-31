import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Loader2, CheckCircle2, AlertCircle, Check, ChevronDown } from 'lucide-react';
import { FORM, HAIR_CONCERNS } from '../config.js';

const PHONE_RE = /^(?:\+?91)?[6-9]\d{9}$/;

function encode(payload, format) {
  if (format === 'form') {
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
    return { body: fd, headers: {} };
  }
  if (format === 'urlencoded') {
    return {
      body: new URLSearchParams(payload).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
  }
  return { body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } };
}

/** Single-select dropdown; picking an option selects it and closes the list. */
function SelectField({ id, options, value, onChange, invalid, describedBy, fieldClass }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const away = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button type="button" id={id} aria-haspopup="listbox" aria-expanded={open} aria-invalid={invalid} aria-describedby={describedBy}
        onClick={() => setOpen((o) => !o)}
        className={`${fieldClass} flex items-center justify-between gap-2 text-left ${invalid ? 'border-red-500' : 'border-ink/15'}`}>
        <span className={`truncate ${value ? 'text-ink' : 'text-ink/40'}`}>{value || 'Select your hair concern'}</span>
        <ChevronDown size={18} aria-hidden className={`shrink-0 text-ink/50 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul role="listbox" className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-ink/15 bg-white text-ink shadow-soft">
          {options.map((o) => (
            <li key={o} role="option" aria-selected={o === value}>
              <button type="button" onClick={() => { onChange(o); setOpen(false); }}
                className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-blush-50 ${o === value ? 'font-medium text-crimson-700' : ''}`}>
                {o}{o === value && <Check size={16} aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Name, mobile, city and a single-select hair concern. */
export default function LeadForm({ id, submitLabel, dark = false }) {
  const [values, setValues] = useState({ name: '', phone: '', city: '', concern: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (values.name.trim().length < 2) e.name = 'Enter your full name.';
    if (!PHONE_RE.test(values.phone.replace(/[\s-]/g, ''))) e.phone = 'Enter a valid 10-digit mobile number.';
    if (values.city.trim().length < 2) e.city = 'Enter your city.';
    if (!values.concern) e.concern = 'Select your hair concern.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (status === 'loading' || !validate()) return;
    setStatus('loading');
    try {
      if (!FORM.apiUrl) throw new Error('API endpoint not configured (src/config.js).');
      const payload = FORM.buildPayload({ ...values, name: values.name.trim(), city: values.city.trim(), phone: values.phone.replace(/[\s-]/g, '') });
      const { body, headers } = encode(payload, FORM.format);
      const res = await fetch(FORM.apiUrl, { method: 'POST', headers, body });
      let json = null;
      try { json = JSON.parse(await res.text()); } catch { /* non-JSON response */ }
      if (!FORM.isSuccess(res, json)) throw new Error(`Request failed (${res.status})`);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: FORM.gtmEvent, form_location: id });
      if (FORM.thankYouPath) { window.location.assign(FORM.thankYouPath); return; }
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const field = 'w-full rounded-xl border bg-white px-4 py-3 text-ink placeholder:text-ink/40 transition-colors focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20';
  const label = `mb-1.5 block text-sm font-medium ${dark ? 'text-blush-100' : 'text-ink-soft'}`;
  const err = (k) => errors[k] && (
    <p id={`${id}-${k}-err`} className="mt-1 flex items-center gap-1 text-sm text-red-600" role="alert">
      <AlertCircle size={14} aria-hidden /> {errors[k]}
    </p>
  );

  if (status === 'success') {
    return (
      <div role="status" className="rounded-xl bg-blush-50 p-6 text-crimson-800">
        <CheckCircle2 className="mb-3" size={28} aria-hidden />
        <p className="font-display text-xl font-medium">Enquiry received</p>
        <p className="mt-1 text-ink-soft">Our team will contact you regarding your enquiry and appointment.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4" aria-describedby={`${id}-note`}>
      <div>
        <label htmlFor={`${id}-name`} className={label}>Full name</label>
        <input id={`${id}-name`} className={`${field} ${errors.name ? 'border-red-500' : 'border-ink/15'}`} autoComplete="name"
          value={values.name} onChange={set('name')} aria-invalid={!!errors.name} aria-describedby={errors.name ? `${id}-name-err` : undefined} />
        {err('name')}
      </div>
      <div>
        <label htmlFor={`${id}-phone`} className={label}>Mobile number</label>
        <input id={`${id}-phone`} type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number"
          className={`${field} ${errors.phone ? 'border-red-500' : 'border-ink/15'}`}
          value={values.phone} onChange={set('phone')} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? `${id}-phone-err` : undefined} />
        {err('phone')}
      </div>
      <div>
        <label htmlFor={`${id}-city`} className={label}>City</label>
        <input id={`${id}-city`} autoComplete="address-level2" placeholder="Your city"
          className={`${field} ${errors.city ? 'border-red-500' : 'border-ink/15'}`}
          value={values.city} onChange={set('city')} aria-invalid={!!errors.city} aria-describedby={errors.city ? `${id}-city-err` : undefined} />
        {err('city')}
      </div>
      <div>
        <label htmlFor={`${id}-concern`} className={label}>Hair concern</label>
        <SelectField id={`${id}-concern`} options={HAIR_CONCERNS} value={values.concern} onChange={(v) => setValues((x) => ({ ...x, concern: v }))} fieldClass={field}
          invalid={!!errors.concern} describedBy={errors.concern ? `${id}-concern-err` : undefined} />
        {err('concern')}
      </div>
      <button type="submit" disabled={status === 'loading'}
        className={`group flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-medium transition disabled:opacity-70 ${dark ? 'bg-white text-crimson-800 hover:bg-blush' : 'grad-crimson text-white shadow-glow hover:brightness-110'}`}>
        {status === 'loading' ? (<><Loader2 className="animate-spin" size={18} aria-hidden /> Sending…</>) : (<>{submitLabel}<ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden /></>)}
      </button>
      {status === 'error' && (
        <p role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden />
          We couldn't send your details. Check your connection and try again, or call the clinic.
        </p>
      )}
      <p id={`${id}-note`} className={`text-sm ${dark ? 'text-blush-200' : 'text-ink-muted'}`}>Our team will contact you regarding your enquiry and appointment.</p>
    </form>
  );
}
