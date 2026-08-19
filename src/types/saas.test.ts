import { describe, it, expect } from 'vitest';
import {
  CURRENT_USER,
  MOCK_KPI_METRICS,
  MOCK_BILLING_TRAJECTORY,
  MOCK_PROJECTS_BY_STATUS,
  MOCK_CLIENTS,
  MOCK_PROJECTS,
  MOCK_INVOICES,
} from '../data/mockSaaSData.ts';

describe('SaaS Domain Models & Data Integrity', () => {
  it('should have valid admin user profile matching the design', () => {
    expect(CURRENT_USER.name).toBe('James Donnelly');
    expect(CURRENT_USER.companyName).toBe('Acme Digital Co.');
    expect(CURRENT_USER.initials).toBe('JD');
  });

  it('should have all 4 executive KPI metrics correctly configured', () => {
    expect(MOCK_KPI_METRICS.length).toBe(4);
    const mrr = MOCK_KPI_METRICS.find((k) => k.id === 'kpi-mrr');
    expect(mrr?.value).toBe('$24,850');
    expect(mrr?.growthPercentage).toBe(18.4);

    const clients = MOCK_KPI_METRICS.find((k) => k.id === 'kpi-clients');
    expect(clients?.value).toBe('42');
    expect(clients?.growthPercentage).toBe(12.5);

    const projects = MOCK_KPI_METRICS.find((k) => k.id === 'kpi-projects');
    expect(projects?.value).toBe('18');

    const invoices = MOCK_KPI_METRICS.find((k) => k.id === 'kpi-invoices');
    expect(invoices?.value).toBe('$4,200');
  });

  it('should have complete billing trajectory for 12 months with May peak matching design', () => {
    expect(MOCK_BILLING_TRAJECTORY.length).toBe(12);
    const mayPoint = MOCK_BILLING_TRAJECTORY.find((p) => p.month === 'May');
    expect(mayPoint).toBeDefined();
    expect(mayPoint?.mrr).toBe(24850);
    expect(mayPoint?.oneTime).toBe(8420);
  });

  it('should have project status distributions totaling 18 projects', () => {
    const totalProjects = MOCK_PROJECTS_BY_STATUS.reduce((sum, item) => sum + item.count, 0);
    expect(totalProjects).toBe(18);

    const totalPercentage = MOCK_PROJECTS_BY_STATUS.reduce((sum, item) => sum + item.percentage, 0);
    expect(Math.round(totalPercentage)).toBe(100);
  });

  it('should have structured clients, projects, and invoices with valid relational IDs', () => {
    expect(MOCK_CLIENTS.length).toBeGreaterThanOrEqual(6);
    expect(MOCK_PROJECTS.length).toBeGreaterThan(0);
    expect(MOCK_INVOICES.length).toBeGreaterThan(0);

    // Verify foreign key integrity in fixtures
    MOCK_PROJECTS.forEach((proj) => {
      const clientExists = MOCK_CLIENTS.some((c) => c.id === proj.clientId);
      expect(clientExists).toBe(true);
    });

    MOCK_INVOICES.forEach((inv) => {
      const clientExists = MOCK_CLIENTS.some((c) => c.id === inv.clientId);
      expect(clientExists).toBe(true);
    });
  });
});
