import { describe, expect, it } from 'vitest';
import { getDashboardPathForRole } from '@/proxy';

describe('proxy helpers', () => {
  it('routes each role to the expected dashboard', () => {
    expect(getDashboardPathForRole('CLIENT')).toBe('/dashboard/client');
    expect(getDashboardPathForRole('ARTISAN')).toBe('/dashboard/artisan');
    expect(getDashboardPathForRole('ADMIN')).toBe('/admin');
  });
});
