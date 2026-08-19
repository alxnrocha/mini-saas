import { z } from 'zod';

export const newInvoiceSchema = z.object({
  clientId: z.string().min(1, 'Please select a client'),
  clientName: z.string().min(1, 'Client name is required'),
  invoiceCode: z
    .string()
    .min(3, 'Invoice code is required')
    .regex(/^INV-\d{4}-\d{3,}$/, 'Invoice code must follow format INV-YYYY-XXX'),
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .min(10, 'Invoice amount must be at least $10'),
  dueDate: z.string().min(1, 'Due date is required'),
  status: z.enum(['paid', 'unpaid', 'overdue', 'cancelled']),
});

export type NewInvoiceFormData = z.infer<typeof newInvoiceSchema>;
