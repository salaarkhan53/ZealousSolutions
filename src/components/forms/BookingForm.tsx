'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Field, fieldClass } from '@/components/ui/Field';
import { booking } from '@/content/site';
import { bookingSchema, type BookingValues } from '@/lib/schemas';
import { submitForm } from '@/lib/submitForm';

/** `min` on the date input, so the picker itself blocks past dates. */
const today = () => new Date().toISOString().split('T')[0];

export function BookingForm() {
  const [sent, setSent] = useState<{ reference: string } | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { service: '', time: '', timezone: '' },
  });

  const onSubmit = async (values: BookingValues) => {
    setFailure(null);

    const payload = new FormData();
    payload.append('form', 'appointment');
    payload.append('name', values.name);
    payload.append('email', values.email);
    payload.append('phone', values.phone);
    payload.append('company', values.company ?? '');
    payload.append('service', values.service);
    payload.append('date', values.date);
    payload.append('time', values.time);
    payload.append('timezone', values.timezone);
    payload.append('message', values.message ?? '');
    payload.append('consent', String(values.consent));
    payload.append('website', values.website ?? '');

    const result = await submitForm(payload);
    if (result.ok) setSent({ reference: result.reference });
    else setFailure(result.error);
  };

  if (sent) {
    return (
      <div
        role="status"
        className="glass flex flex-col items-center rounded-2xl px-6 py-14 text-center"
      >
        <CheckCircle2 className="h-11 w-11 text-gold" strokeWidth={1.5} />
        <h3 className="mt-5 text-xl">Request received</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
          Thank you. A member of the team will confirm your appointment by email shortly.
        </p>
        <p className="mt-6 rounded-full border border-gold/25 px-5 py-2 text-xs tracking-wide text-gold">
          Reference {sent.reference}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="glass relative rounded-2xl p-6 sm:p-8"
    >
      {/* Honeypot: off-screen rather than display:none, which some bots detect. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Full name" required error={errors.name?.message}>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Okafor"
            className={fieldClass}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            {...register('name')}
          />
        </Field>

        <Field id="email" label="Work email" required error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="jane@company.com"
            className={fieldClass}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
        </Field>

        <Field
          id="phone"
          label="Phone"
          required
          error={errors.phone?.message}
          hint="Pakistani (+92) or US (+1) numbers only"
        >
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+1 325 202 4836"
            className={fieldClass}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            {...register('phone')}
          />
        </Field>

        <Field id="company" label="Company" error={errors.company?.message}>
          <input
            id="company"
            type="text"
            autoComplete="organization"
            placeholder="Company name"
            className={fieldClass}
            {...register('company')}
          />
        </Field>

        <Field
          id="service"
          label="Service you're interested in"
          required
          error={errors.service?.message}
          className="sm:col-span-2"
        >
          <select
            id="service"
            className={fieldClass}
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? 'service-error' : undefined}
            {...register('service')}
          >
            <option value="">Select a service…</option>
            {booking.serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field id="date" label="Preferred date" required error={errors.date?.message}>
          <input
            id="date"
            type="date"
            min={today()}
            className={fieldClass}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? 'date-error' : undefined}
            {...register('date')}
          />
        </Field>

        <Field id="time" label="Preferred time" required error={errors.time?.message}>
          <select
            id="time"
            className={fieldClass}
            aria-invalid={Boolean(errors.time)}
            aria-describedby={errors.time ? 'time-error' : undefined}
            {...register('time')}
          >
            <option value="">Select a slot…</option>
            {booking.timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id="timezone"
          label="Your timezone"
          required
          error={errors.timezone?.message}
          className="sm:col-span-2"
        >
          <select
            id="timezone"
            className={fieldClass}
            aria-invalid={Boolean(errors.timezone)}
            aria-describedby={errors.timezone ? 'timezone-error' : undefined}
            {...register('timezone')}
          >
            <option value="">Select a timezone…</option>
            {booking.timezones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id="message"
          label="What would you like to discuss?"
          error={errors.message?.message}
          className="sm:col-span-2"
        >
          <textarea
            id="message"
            rows={4}
            placeholder="Volumes, channels, timelines, whatever helps us prepare."
            className={`${fieldClass} resize-y`}
            {...register('message')}
          />
        </Field>
      </div>

      <div className="mt-6 flex gap-3">
        <input
          id="consent"
          type="checkbox"
          className="mt-px h-5 w-5 shrink-0 accent-[#d4af37]"
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? 'consent-error' : undefined}
          {...register('consent')}
        />
        <div>
          <label htmlFor="consent" className="text-xs leading-relaxed text-muted">
            I agree that Zealous Solutions may contact me about this enquiry.
          </label>
          {errors.consent && (
            <p id="consent-error" role="alert" className="mt-1 text-xs text-[#ff9b8a]">
              {errors.consent.message}
            </p>
          )}
        </div>
      </div>

      {failure && (
        <p role="alert" className="mt-5 rounded-xl border border-[#ff9b8a]/30 bg-[#ff9b8a]/5 px-4 py-3 text-xs text-[#ff9b8a]">
          {failure}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="mt-7 w-full">
        {isSubmitting ? 'Sending…' : 'Request appointment'}
        {!isSubmitting && <ArrowRight className="h-4 w-4" strokeWidth={2} />}
      </Button>
    </form>
  );
}
