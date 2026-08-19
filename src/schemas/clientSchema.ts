import { z } from 'zod';

export const newClientSchema = z.object({
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name cannot exceed 100 characters'),
  domain: z
    .string()
    .min(3, 'Domain must be at least 3 characters')
    .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid domain (e.g. acme.com)'),
  contactName: z
    .string()
    .min(2, 'Contact name must be at least 2 characters')
    .max(100, 'Contact name cannot exceed 100 characters'),
  contactEmail: z
    .string()
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .optional()
    .or(z.literal('')),
  status: z.enum(['active', 'onboarding', 'paused', 'churned']),
  mrr: z
    .number({ invalid_type_error: 'MRR must be a number' })
    .min(0, 'MRR cannot be negative'),
});

export type NewClientFormData = z.infer<typeof newClientSchema>;
