import { describe, it, expect } from 'vitest';
import {
  CURRENT_USER,
  MOCK_KPI_METRICS,
  MOCK_BILLING_TRAJECTORY,
  MOCK_PROJECTS_BY_STATUS,
} from '../../data/mockSaaSData.ts';

describe('ExecutiveDashboard Components & Charts', () => {
  it('should supply complete data props for Executive Dashboard render', () => {
    expect(CURRENT_USER.name).toBe('James Donnelly');
    expect(MOCK_KPI_METRICS.length).toBe(4);
    expect(MOCK_BILLING_TRAJECTORY.length).toBe(12);
    expect(MOCK_PROJECTS_BY_STATUS.length).toBe(4);
  });
});
