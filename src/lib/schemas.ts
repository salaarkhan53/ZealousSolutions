import { z } from 'zod';
import {
  ADDRESS_MESSAGE,
  ADDRESS_PATTERN,
  COMPANY_MESSAGE,
  COMPANY_PATTERN,
  CV_MAX_BYTES,
  describeCvError,
  hasEnoughLetters,
  isAllowedPhone,
  NAME_MESSAGE,
  NAME_PATTERN,
  PHONE_MESSAGE,
  PLACE_MESSAGE,
  PLACE_PATTERN,
} from './validation';

/** Today at midnight, so "today" stays a valid appointment date. */
const startOfToday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

const name = z
  .string()
  .trim()
  .min(2, 'Please enter your full name')
  .max(80, 'That name seems too long')
  .regex(NAME_PATTERN, NAME_MESSAGE)
  .refine((v) => hasEnoughLetters(v), NAME_MESSAGE);

const email = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .max(150, 'That email seems too long')
  .pipe(z.email('Enter a valid email address'));

const phone = z
  .string()
  .trim()
  .min(1, 'Phone number is required')
  .refine(isAllowedPhone, PHONE_MESSAGE);

const place = (label: string) =>
  z
    .string()
    .trim()
    .max(60, `That ${label} seems too long`)
    .refine((v) => v === '' || PLACE_PATTERN.test(v), PLACE_MESSAGE)
    .optional()
    .or(z.literal(''));

/** Hidden field. Real people leave it empty; bots fill everything. */
const honeypot = z.string().max(0, 'Submission blocked').optional();

export const bookingSchema = z.object({
  name,
  email,
  phone,
  company: z
    .string()
    .trim()
    .max(120, 'That company name seems too long')
    .refine((v) => v === '' || COMPANY_PATTERN.test(v), COMPANY_MESSAGE)
    .optional()
    .or(z.literal('')),
  service: z.string().min(1, 'Choose a service'),
  date: z
    .string()
    .min(1, 'Choose a preferred date')
    .refine((value) => {
      const parsed = new Date(`${value}T00:00:00`);
      return !Number.isNaN(parsed.getTime()) && parsed >= startOfToday();
    }, 'Choose today or a future date'),
  time: z.string().min(1, 'Choose a preferred time'),
  timezone: z.string().min(1, 'Choose your timezone'),
  message: z
    .string()
    .trim()
    .max(1500, 'Please keep this under 1500 characters')
    .optional()
    .or(z.literal('')),
  consent: z.literal(true, { message: 'Please confirm we can contact you' }),
  website: honeypot,
});

/**
 * Job application. Mirrors the supplied form design, with the CV made required
 * - an application without one cannot be assessed.
 */
export const applicationSchema = z.object({
  position: z.string().min(1, 'Choose a position'),
  name,
  email,
  phone,
  address: z
    .string()
    .trim()
    .min(5, 'Please enter your street address')
    .max(120, 'That address seems too long')
    .regex(ADDRESS_PATTERN, ADDRESS_MESSAGE),
  city: place('city'),
  state: place('state'),
  experience: z.string().min(1, 'Select your years of experience'),
  // superRefine rather than refine: it lets the message name the actual
  // problem (wrong type / too large / empty) instead of one generic string.
  cv: z.custom<FileList>().superRefine((files, ctx) => {
    const file = files?.[0];
    if (!file) {
      ctx.addIssue({ code: 'custom', message: 'Attach your CV' });
      return;
    }
    const problem = describeCvError(file);
    if (problem) ctx.addIssue({ code: 'custom', message: problem });
  }),
  website: honeypot,
});

export const CV_MAX_MB = CV_MAX_BYTES / 1024 / 1024;

export type BookingValues = z.infer<typeof bookingSchema>;
export type ApplicationValues = z.infer<typeof applicationSchema>;
