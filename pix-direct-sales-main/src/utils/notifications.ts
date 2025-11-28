export type NotificationItem = {
  id?: string;
  type: 'sale' | 'subscription_warning';
  metadata?: Record<string, unknown>;
  created_at?: string;
};

export function getWarningThresholds(expiresAtISO: string, nowMs = Date.now()): number[] {
  const end = new Date(expiresAtISO).getTime();
  const daysLeft = Math.floor((end - nowMs) / (24 * 60 * 60 * 1000));
  const thresholds = [7, 3, 1];
  return thresholds.filter((d) => daysLeft === d);
}

export function shouldInsertWarning(existing: NotificationItem[], code: string): boolean {
  return !existing.some((n) => n.type === 'subscription_warning' && typeof n.metadata?.code === 'string' && n.metadata?.code === code);
}

export function generateSaleNotificationPayload(sale: { id: string; amount: number; status: string; product_id?: string }): NotificationItem {
  return {
    type: 'sale',
    metadata: { sale_id: sale.id, amount: sale.amount, status: sale.status, product_id: sale.product_id },
  };
}

