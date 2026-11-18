import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("returns minimal ok JSON without PII or secrets", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");

    const body = (await response.json()) as Record<string, unknown>;
    expect(body.status).toBe("ok");
    expect(body.service).toBe("oak");
    expect(typeof body.timestampUtc).toBe("string");
    expect(Number.isNaN(Date.parse(String(body.timestampUtc)))).toBe(false);

    const serialized = JSON.stringify(body).toLowerCase();
    for (const forbiddenKey of [
      "email",
      "password",
      "token",
      "secret",
      "database",
      "stripe",
      "supabase",
      "cookie",
    ]) {
      expect(serialized).not.toContain(forbiddenKey);
    }
  });
});
