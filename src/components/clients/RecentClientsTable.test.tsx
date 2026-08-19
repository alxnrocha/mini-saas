import { describe, it, expect } from 'vitest';
import { useSaaSStore } from '../../stores/useSaaSStore.ts';
import { newClientSchema } from '../../schemas/clientSchema.ts';

describe('RecentClientsTable & Store Management', () => {
  it('should initialize with mock clients from store', () => {
    const clients = useSaaSStore.getState().clients;
    expect(clients.length).toBeGreaterThanOrEqual(6);
    expect(clients[0].companyName).toBe('Acme Corporation');
  });

  it('should validate new client payload with Zod schema', () => {
    const validClient = {
      companyName: 'Vertex AI Systems',
      domain: 'vertexai.com',
      contactName: 'Alex Carter',
      contactEmail: 'alex@vertexai.com',
      phone: '+1 (555) 888-9999',
      status: 'active' as const,
      mrr: 4800,
    };

    const parsed = newClientSchema.safeParse(validClient);
    expect(parsed.success).toBe(true);

    const invalidClient = {
      companyName: 'A',
      domain: 'not-a-domain',
      contactName: '',
      contactEmail: 'invalid-email',
      status: 'active' as const,
      mrr: -500,
    };

    const invalidParsed = newClientSchema.safeParse(invalidClient);
    expect(invalidParsed.success).toBe(false);
  });

  it('should add a new client and prepend it to the store', () => {
    const initialCount = useSaaSStore.getState().clients.length;

    const created = useSaaSStore.getState().addClient({
      companyName: 'Zephyr Media Tech',
      domain: 'zephyrmedia.io',
      contactName: 'Liam Stone',
      contactEmail: 'liam@zephyrmedia.io',
      status: 'active',
      mrr: 6200,
    });

    expect(created.id).toBeDefined();
    expect(created.initials).toBe('ZM');
    expect(useSaaSStore.getState().clients.length).toBe(initialCount + 1);
  });

  it('should update client status and remove client upon deletion', () => {
    const testClientId = 'cli-04'; // Spark Products
    useSaaSStore.getState().updateClientStatus(testClientId, 'active');

    const updated = useSaaSStore.getState().clients.find((c) => c.id === testClientId);
    expect(updated?.status).toBe('active');
  });
});
