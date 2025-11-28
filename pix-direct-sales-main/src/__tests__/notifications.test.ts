import { describe, it, expect } from 'vitest';
import { getWarningThresholds, shouldInsertWarning, generateSaleNotificationPayload } from '@/utils/notifications';

describe('notifications utils', () => {
  it('returns thresholds when days left match 7, 3, 1', () => {
    const now = Date.now();
    const sevenDays = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();
    const threeDays = new Date(now + 3 * 24 * 60 * 60 * 1000).toISOString();
    const oneDay = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    expect(getWarningThresholds(sevenDays, now)).toEqual([7]);
    expect(getWarningThresholds(threeDays, now)).toEqual([3]);
    expect(getWarningThresholds(oneDay, now)).toEqual([1]);
  });

  it('returns empty when not at thresholds', () => {
    const now = Date.now();
    const eightDays = new Date(now + 8 * 24 * 60 * 60 * 1000).toISOString();
    expect(getWarningThresholds(eightDays, now)).toEqual([]);
  });

  it('shouldInsertWarning prevents duplicates by code', () => {
    const existing = [{ type: 'subscription_warning' as const, metadata: { code: 'subscription-7d' } }];
    expect(shouldInsertWarning(existing, 'subscription-7d')).toBe(false);
    expect(shouldInsertWarning(existing, 'subscription-3d')).toBe(true);
  });

  it('generateSaleNotificationPayload maps sale fields', () => {
    const sale = { id: 's1', amount: 10.5, status: 'approved', product_id: 'p1' };
    const payload = generateSaleNotificationPayload(sale);
    expect(payload.type).toBe('sale');
    expect(payload.metadata).toMatchObject({ sale_id: 's1', amount: 10.5, status: 'approved', product_id: 'p1' });
  });

  it('performance: handle 10k notifications in < 200ms', () => {
    const start = performance.now();
    const arr = Array.from({ length: 10000 }, (_, i) => ({ type: 'subscription_warning' as const, metadata: { code: `c${i}` } }));
    const ok = shouldInsertWarning(arr as any, 'c10001');
    const end = performance.now();
    expect(ok).toBe(true);
    expect(end - start).toBeLessThan(200);
  });
});

