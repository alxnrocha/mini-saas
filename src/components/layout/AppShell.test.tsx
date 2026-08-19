import { describe, it, expect } from 'vitest';
import { CURRENT_USER } from '../../data/mockSaaSData.ts';

describe('AppShell Layout & Navigation', () => {
  it('should have user profile with valid credentials for Shell rendering', () => {
    expect(CURRENT_USER.initials).toBe('JD');
    expect(CURRENT_USER.companyName).toBe('Acme Digital Co.');
  });
});
