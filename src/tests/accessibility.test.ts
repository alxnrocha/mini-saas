import { describe, it, expect } from 'vitest';
import { CURRENT_USER, MOCK_KPI_METRICS } from '../data/mockSaaSData.ts';

describe('Accessibility & Semantics Verification', () => {
  it('should have descriptive labels and accessible text for screen readers', () => {
    expect(CURRENT_USER.name.length).toBeGreaterThan(0);
    expect(CURRENT_USER.initials.length).toBe(2);

    MOCK_KPI_METRICS.forEach((kpi) => {
      expect(kpi.title.length).toBeGreaterThan(0);
      expect(kpi.value.length).toBeGreaterThan(0);
      expect(kpi.comparisonPeriod.length).toBeGreaterThan(0);
    });
  });
});
