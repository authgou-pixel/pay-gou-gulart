export type NewProductData = { name: string; description?: string; price: string };
export function validateNewProduct(data: NewProductData) {
  const nameOk = typeof data.name === "string" && data.name.trim().length > 0;
  const priceVal = parseFloat(data.price || "0");
  const priceOk = !Number.isNaN(priceVal) && priceVal >= 0;
  return nameOk && priceOk;
}

export type LessonPayload = { product_id: string; title: string; content_type?: string | null; content_url?: string | null };
export function validateLessonPayload(payload: LessonPayload) {
  const pidOk = typeof payload.product_id === "string" && payload.product_id.length > 0;
  const titleOk = typeof payload.title === "string" && payload.title.trim().length > 0;
  return pidOk && titleOk;
}

export type Membership = { product_id: string; status: string; buyer_user_id?: string | null; buyer_email?: string | null };
export function canAccessProduct(memberships: Membership[], userId: string, email: string, productId: string) {
  return memberships.some(m => m.product_id === productId && m.status === "approved" && (m.buyer_user_id === userId || m.buyer_email === email));
}
