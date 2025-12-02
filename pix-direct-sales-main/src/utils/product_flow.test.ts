import { describe, it, expect } from "vitest";
import { validateNewProduct, validateLessonPayload, canAccessProduct } from "./product_flow";

describe("product flow utils", () => {
  it("allows creating product without content URL", () => {
    const ok = validateNewProduct({ name: "Curso", price: "37.90" });
    expect(ok).toBe(true);
  });

  it("validates lesson linking payload", () => {
    const ok = validateLessonPayload({ product_id: "pid", title: "Aula 1", content_type: "video", content_url: "https://example.com/v.mp4" });
    expect(ok).toBe(true);
  });

  it("grants access to members with approved status", () => {
    const memberships = [
      { product_id: "p1", status: "approved", buyer_user_id: "u1", buyer_email: "a@b.com" },
    ];
    const ok = canAccessProduct(memberships, "u1", "a@b.com", "p1");
    expect(ok).toBe(true);
  });
});
