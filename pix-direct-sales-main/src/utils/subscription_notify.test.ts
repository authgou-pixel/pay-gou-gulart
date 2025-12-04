import { describe, it, expect } from "vitest";
import { computeMonthlyExpiry, shouldNotify, formatRemainingMessage } from "./subscription";

describe("subscription notification", () => {
  it("computes monthly expiry 30 days after activation", () => {
    const start = new Date("2025-12-01T00:00:00.000Z");
    const expiry = new Date(computeMonthlyExpiry(start));
    const diff = (expiry.getTime() - start.getTime());
    expect(Math.round(diff / (24 * 60 * 60_000))).toBe(30);
  });

  it("notifies only when 7 days or less remain", () => {
    const eightDays = 8 * 24 * 60 * 60_000;
    const sevenDays = 7 * 24 * 60 * 60_000;
    const sixDays = 6 * 24 * 60 * 60_000;
    expect(shouldNotify(eightDays)).toBe(false);
    expect(shouldNotify(sevenDays)).toBe(true);
    expect(shouldNotify(sixDays)).toBe(true);
  });

  it("formats remaining message correctly", () => {
    const sixDaysMs = 6 * 24 * 60 * 60_000;
    const msgDays = formatRemainingMessage(sixDaysMs);
    expect(msgDays.toLowerCase()).toContain("6 dia");

    const fiveHoursMs = 5 * 60 * 60_000;
    const msgHours = formatRemainingMessage(fiveHoursMs);
    expect(msgHours.toLowerCase()).toContain("5 hora");

    const fifteenMinutesMs = 15 * 60_000;
    const msgMinutes = formatRemainingMessage(fifteenMinutesMs);
    expect(msgMinutes.toLowerCase()).toContain("15 minuto");
  });
});

