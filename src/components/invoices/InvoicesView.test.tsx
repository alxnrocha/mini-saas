import { describe, it, expect } from 'vitest';
import { useSaaSStore } from '../../stores/useSaaSStore.ts';
import { newInvoiceSchema } from '../../schemas/invoiceSchema.ts';

describe('InvoicesView & Billing Management', () => {
  it('should have initial invoices in store', () => {
    const invoices = useSaaSStore.getState().invoices;
    expect(invoices.length).toBeGreaterThanOrEqual(5);
    expect(invoices[0].invoiceCode).toBe('INV-2025-054');
  });

  it('should validate new invoice with Zod schema', () => {
    const valid = {
      clientId: 'cli-01',
      clientName: 'Acme Corporation',
      invoiceCode: 'INV-2025-999',
      amount: 4500,
      dueDate: '2025-07-01',
      status: 'unpaid' as const,
    };

    const parsed = newInvoiceSchema.safeParse(valid);
    expect(parsed.success).toBe(true);

    const invalid = {
      clientId: '',
      clientName: '',
      invoiceCode: 'INVALID-CODE',
      amount: -10,
      dueDate: '',
      status: 'unpaid' as const,
    };

    const invalidParsed = newInvoiceSchema.safeParse(invalid);
    expect(invalidParsed.success).toBe(false);
  });

  it('should add a new invoice and deduct unpaid amount when marked as paid', () => {
    const initialInvoices = useSaaSStore.getState().invoices.length;

    const created = useSaaSStore.getState().addInvoice({
      clientId: 'cli-02', // Innovate Labs
      clientName: 'Innovate Labs',
      invoiceCode: 'INV-2025-888',
      amount: 1500,
      dueDate: '2025-07-15',
      status: 'unpaid',
    });

    expect(created.id).toBeDefined();
    expect(useSaaSStore.getState().invoices.length).toBe(initialInvoices + 1);

    // Mark as paid
    useSaaSStore.getState().markInvoiceAsPaid(created.id);
    const updated = useSaaSStore.getState().invoices.find((i) => i.id === created.id);
    expect(updated?.status).toBe('paid');
    expect(updated?.paidAt).toBeDefined();
  });
});
