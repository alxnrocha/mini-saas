import { describe, it, expect } from 'vitest';
import { useSaaSStore } from '../../stores/useSaaSStore.ts';
import { newProjectSchema } from '../../schemas/projectSchema.ts';

describe('ProjectsView & Project Management', () => {
  it('should have initial projects loaded in store', () => {
    const projects = useSaaSStore.getState().projects;
    expect(projects.length).toBeGreaterThanOrEqual(5);
  });

  it('should validate new project with Zod schema', () => {
    const valid = {
      clientId: 'cli-01',
      clientName: 'Acme Corporation',
      name: 'Security Pentest & Vault Hardening',
      budget: 22000,
      status: 'in_progress' as const,
      progressPercentage: 50,
      deadline: '2025-10-15',
    };

    const result = newProjectSchema.safeParse(valid);
    expect(result.success).toBe(true);

    const invalid = {
      clientId: '',
      clientName: '',
      name: 'No',
      budget: 10,
      status: 'in_progress' as const,
      progressPercentage: 150,
    };

    const invalidResult = newProjectSchema.safeParse(invalid);
    expect(invalidResult.success).toBe(false);
  });

  it('should add project and update project status in store', () => {
    const initialCount = useSaaSStore.getState().projects.length;

    const created = useSaaSStore.getState().addProject({
      clientId: 'cli-03',
      clientName: 'Global Ventures',
      name: 'Multi-Region High Availability Cluster',
      budget: 50000,
      status: 'planning',
      progressPercentage: 10,
      deadline: '2025-12-01',
    });

    expect(created.id).toBeDefined();
    expect(useSaaSStore.getState().projects.length).toBe(initialCount + 1);

    // Update status
    useSaaSStore.getState().updateProjectStatus(created.id, 'completed');
    const updated = useSaaSStore.getState().projects.find((p) => p.id === created.id);
    expect(updated?.status).toBe('completed');
    expect(updated?.progressPercentage).toBe(100);
  });
});
