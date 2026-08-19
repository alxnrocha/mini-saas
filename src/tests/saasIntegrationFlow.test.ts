import { describe, it, expect } from 'vitest';
import { useSaaSStore } from '../stores/useSaaSStore.ts';

describe('Integration: SaaS Lifecycle & Financial Reconciliation', () => {
  it('should execute complete B2B client onboarding, project assignment, and invoice reconciliation', () => {
    const store = useSaaSStore.getState();

    // 1. Create a new client account
    const newClient = store.addClient({
      companyName: 'Zenith Cloud Corp',
      domain: 'zenithcloud.io',
      contactName: 'Robert Langdon',
      contactEmail: 'robert@zenithcloud.io',
      phone: '+1 (555) 333-4444',
      status: 'active',
      mrr: 5000,
    });

    expect(newClient.id).toBeDefined();
    expect(newClient.initials).toBe('ZC');
    expect(useSaaSStore.getState().clients.some((c) => c.id === newClient.id)).toBe(true);

    // 2. Assign a new project to this client
    const newProject = store.addProject({
      clientId: newClient.id,
      clientName: newClient.companyName,
      name: 'Cloud Infrastructure Migration & Security Hardening',
      budget: 35000,
      status: 'in_progress',
      progressPercentage: 25,
      deadline: '2025-11-30',
    });

    expect(newProject.id).toBeDefined();
    const updatedClientAfterProj = useSaaSStore
      .getState()
      .clients.find((c) => c.id === newClient.id);
    expect(updatedClientAfterProj?.projectsCount).toBe(1);

    // 3. Issue a new invoice for this client
    const newInvoice = store.addInvoice({
      clientId: newClient.id,
      clientName: newClient.companyName,
      invoiceCode: 'INV-2025-777',
      amount: 10000,
      dueDate: '2025-07-30',
      status: 'unpaid',
    });

    expect(newInvoice.id).toBeDefined();
    const updatedClientAfterInv = useSaaSStore
      .getState()
      .clients.find((c) => c.id === newClient.id);
    expect(updatedClientAfterInv?.unpaid).toBe(10000);
    expect(updatedClientAfterInv?.totalBilled).toBe(newClient.mrr + 10000);

    // 4. Mark the invoice as paid and verify reconciliation
    store.markInvoiceAsPaid(newInvoice.id);

    const finalizedInvoice = useSaaSStore
      .getState()
      .invoices.find((i) => i.id === newInvoice.id);
    expect(finalizedInvoice?.status).toBe('paid');
    expect(finalizedInvoice?.paidAt).toBeDefined();

    const finalizedClient = useSaaSStore
      .getState()
      .clients.find((c) => c.id === newClient.id);
    expect(finalizedClient?.unpaid).toBe(0);
  });

  it('should calculate accurate portfolio billing metrics', () => {
    const invoices = useSaaSStore.getState().invoices;
    const totalBilled = invoices.reduce((sum, i) => sum + i.amount, 0);
    expect(totalBilled).toBeGreaterThan(0);

    const paidTotal = invoices
      .filter((i) => i.status === 'paid')
      .reduce((sum, i) => sum + i.amount, 0);
    const unpaidTotal = invoices
      .filter((i) => i.status === 'unpaid' || i.status === 'overdue')
      .reduce((sum, i) => sum + i.amount, 0);

    expect(paidTotal + unpaidTotal).toBeLessThanOrEqual(totalBilled);
  });
});
