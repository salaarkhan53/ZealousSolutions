'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, CheckCircle2, FileUp, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Field, fieldClass } from '@/components/ui/Field';
import { careers } from '@/content/site';
import { applicationSchema, type ApplicationValues } from '@/lib/schemas';
import { submitForm } from '@/lib/submitForm';
import { CV_ACCEPT } from '@/lib/validation';

export function ApplicationForm({
  position,
}: {
  /** Set by the page from the role whose "Apply now" was clicked. */
  position: string;
}) {
  const [sent, setSent] = useState<{ reference: string } | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    resetField,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    // Every text field needs an empty-string default. Leaving them undefined
    // makes Zod report "expected string, received undefined" instead of the
    // friendly per-field messages.
    defaultValues: {
      position,
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      experience: '',
      website: '',
    },
  });

  // Choosing a different role updates the field without discarding anything
  // already typed - which is what re-keying via `values` would have done.
  useEffect(() => {
    setValue('position', position, { shouldValidate: true });
  }, [position, setValue]);

  const cvFiles = watch('cv');
  const chosenFile = cvFiles?.[0];

  const { ref: cvRef, ...cvField } = register('cv');

  const onSubmit = async (values: ApplicationValues) => {
    setFailure(null);

    // The subject line uses the role's short code ("CSR", "Verification");
    // the body carries the full title. send.php checks this against its own
    // allowlist, so a tampered value can't reshape the subject.
    const role = careers.openRoles.find((r) => r.title === values.position);

    const payload = new FormData();
    payload.append('form', 'application');
    payload.append('position', values.position);
    payload.append('code', role?.code ?? 'General');
    payload.append('name', values.name);
    payload.append('email', values.email);
    payload.append('phone', values.phone);
    payload.append('address', values.address);
    payload.append('city', values.city ?? '');
    payload.append('state', values.state ?? '');
    payload.append('experience', values.experience);
    payload.append('website', values.website ?? '');
    payload.append('cv', values.cv[0]);

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
        <h3 className="mt-5 text-xl">Application received</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
          Thanks for applying. If your experience matches what we need, someone from the team will
          be in touch.
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
        <label htmlFor="a-website">Leave this field empty</label>
        <input id="a-website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      {/* Position is carried by the page, not chosen here. */}
      <input type="hidden" {...register('position')} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="a-name"
          label="Your name"
          required
          error={errors.name?.message}
          className="sm:col-span-2"
        >
          <input
            id="a-name"
            type="text"
            autoComplete="name"
            placeholder="E.g. Ayesha Khan"
            className={fieldClass}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'a-name-error' : undefined}
            {...register('name')}
          />
        </Field>

        <Field id="a-email" label="Your email" required error={errors.email?.message}>
          <input
            id="a-email"
            type="email"
            autoComplete="email"
            placeholder="E.g. you@email.com"
            className={fieldClass}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'a-email-error' : undefined}
            {...register('email')}
          />
        </Field>

        {/* Upload CV - the native control is hidden behind a themed trigger, but
            remains a real file input so keyboard and screen readers work. */}
        <Field
          id="a-cv"
          label="Upload CV"
          required
          error={errors.cv?.message as string | undefined}
          hint={!chosenFile ? 'PDF or Word document, up to 5 MB' : undefined}
        >
          <div className="flex items-center gap-3">
            <input
              id="a-cv"
              type="file"
              accept={CV_ACCEPT}
              className="sr-only"
              aria-invalid={Boolean(errors.cv)}
              aria-describedby={errors.cv ? 'a-cv-error' : undefined}
              {...cvField}
              ref={(node) => {
                cvRef(node);
                fileInputRef.current = node;
              }}
            />
            <label
              htmlFor="a-cv"
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-xs font-semibold text-gold transition-colors hover:border-gold hover:bg-gold/15"
            >
              <FileUp className="h-4 w-4" strokeWidth={1.5} />
              Choose file
            </label>

            {chosenFile ? (
              <span className="flex min-w-0 items-center gap-2 text-xs text-ink/80">
                <span className="truncate">{chosenFile.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    resetField('cv');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="shrink-0 text-muted transition-colors hover:text-gold"
                  aria-label="Remove selected file"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </span>
            ) : (
              <span className="truncate text-xs text-muted">No file chosen</span>
            )}
          </div>
        </Field>

        <Field
          id="a-address"
          label="Street address"
          required
          error={errors.address?.message}
          className="sm:col-span-2"
        >
          <input
            id="a-address"
            type="text"
            autoComplete="street-address"
            placeholder="E.g. 12 Jinnah Avenue"
            className={fieldClass}
            aria-invalid={Boolean(errors.address)}
            aria-describedby={errors.address ? 'a-address-error' : undefined}
            {...register('address')}
          />
        </Field>

        <Field id="a-city" label="City" error={errors.city?.message}>
          <input
            id="a-city"
            type="text"
            autoComplete="address-level2"
            placeholder="E.g. Islamabad"
            className={fieldClass}
            {...register('city')}
          />
        </Field>

        <Field id="a-state" label="State/Province" error={errors.state?.message}>
          <input
            id="a-state"
            type="text"
            autoComplete="address-level1"
            placeholder="E.g. Punjab"
            className={fieldClass}
            {...register('state')}
          />
        </Field>

        <Field
          id="a-phone"
          label="Phone"
          required
          error={errors.phone?.message}
          hint="Pakistani (+92) or US (+1) numbers only"
          className="sm:col-span-2"
        >
          <input
            id="a-phone"
            type="tel"
            autoComplete="tel"
            placeholder="E.g. +92 300 1234567"
            className={fieldClass}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'a-phone-error' : undefined}
            {...register('phone')}
          />
        </Field>
      </div>

      {/* Years of experience - radio group, matching the supplied design. */}
      <fieldset className="mt-7">
        <legend className="text-xs font-medium tracking-wide text-ink/80">
          Years of experience
          <span className="ml-1 text-gold" aria-hidden="true">
            *
          </span>
        </legend>

        <div className="mt-3 flex flex-wrap gap-2.5">
          {careers.experienceOptions.map((option) => (
            <label
              key={option}
              className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs text-ink/85 transition-colors hover:border-gold/50 has-checked:border-gold/70 has-checked:bg-gold/10 has-checked:text-ink"
            >
              <input
                type="radio"
                value={option}
                className="h-3.5 w-3.5 accent-[#d4af37]"
                {...register('experience')}
              />
              {option}
            </label>
          ))}
        </div>

        {errors.experience && (
          <p role="alert" className="mt-2.5 text-xs text-[#ff9b8a]">
            {errors.experience.message}
          </p>
        )}
      </fieldset>

      {failure && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-[#ff9b8a]/30 bg-[#ff9b8a]/5 px-4 py-3 text-xs leading-relaxed text-[#ff9b8a]"
        >
          {failure}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="mt-7 w-full">
        {isSubmitting ? 'Sending…' : 'Submit application'}
        {!isSubmitting && <ArrowRight className="h-4 w-4" strokeWidth={2} />}
      </Button>
    </form>
  );
}
