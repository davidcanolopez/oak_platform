import { describe, expect, it } from "vitest";
import { getServerEnv, parseEnv } from "@/shared/env";

const baseLocalEnv = {
  APP_ENV: "local",
  DATABASE_URL: "postgresql://oak_app@127.0.0.1:5432/oak_dev",
  NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "synthetic-anon-key-local",
};

const baseDeployedEnv = {
  ...baseLocalEnv,
  NEXT_PUBLIC_APP_URL: "https://staging.oak-platform.invalid",
  SUPABASE_SERVICE_ROLE_KEY: "synthetic-service-role-key",
  STRIPE_SECRET_KEY: "synthetic-stripe-test-key",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "synthetic-stripe-pub-key",
  STRIPE_WEBHOOK_SECRET: "synthetic-stripe-webhook-key",
  RESEND_API_KEY: "synthetic-resend-sandbox-key",
  OAK_EMAIL_FROM: "avisos@test.oak.invalid",
  SENTRY_DSN: "https://synthetic@sentry.oak.invalid/1",
};

const syntheticLiveSecretKey = ["sk", "live", "oak_guard_check"].join("_");
const syntheticLivePublishableKey = ["pk", "live", "oak_guard_check"].join("_");
const syntheticLiveRestrictedKey = ["rk", "live", "oak_guard_check"].join("_");

describe("parseEnv fail-closed validation", () => {
  it("accepts valid local configuration with safe defaults", () => {
    const env = parseEnv(baseLocalEnv);
    expect(env.APP_ENV).toBe("local");
    expect(env.NEXT_PUBLIC_APP_URL).toBe("http://127.0.0.1:3000");
    expect(env.OAK_ENABLE_LIVE_PAYMENTS).toBe("false");
    expect(env.OAK_ALLOW_DEMO_SEED).toBe("false");
  });

  it("accepts valid preview, staging and safe production configurations", () => {
    const preview = parseEnv({ ...baseDeployedEnv, APP_ENV: "preview" });
    const staging = parseEnv({ ...baseDeployedEnv, APP_ENV: "staging" });
    const prod = getServerEnv({
      ...baseDeployedEnv,
      APP_ENV: "production",
      OAK_ALLOW_DEMO_SEED: "false",
    });

    expect(preview.APP_ENV).toBe("preview");
    expect(staging.APP_ENV).toBe("staging");
    expect(prod.APP_ENV).toBe("production");
  });

  it("fails closed when APP_ENV is missing or unknown", () => {
    expect(() => parseEnv()).toThrow(/APP_ENV/);
    expect(() => parseEnv({})).toThrow(/APP_ENV/);
    expect(() => parseEnv(null as unknown as Record<string, string | undefined>)).toThrow(
      /APP_ENV/,
    );
    expect(() => parseEnv({ ...baseLocalEnv, APP_ENV: "qa-unknown" })).toThrow(/APP_ENV/);
  });

  it("fails closed when mandatory local variables are missing", () => {
    expect(() =>
      parseEnv({
        APP_ENV: "local",
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "synthetic-anon-key-local",
      }),
    ).toThrow(/DATABASE_URL/);
  });

  it("fails closed when mandatory secrets are missing in staging", () => {
    const { STRIPE_WEBHOOK_SECRET: _omitted, ...missingWebhook } = baseDeployedEnv;
    void _omitted;
    expect(() => parseEnv({ ...missingWebhook, APP_ENV: "staging" })).toThrow(
      /STRIPE_WEBHOOK_SECRET/,
    );
  });

  it("blocks demo seed flag in production", () => {
    expect(() =>
      parseEnv({
        ...baseDeployedEnv,
        APP_ENV: "production",
        OAK_ALLOW_DEMO_SEED: "true",
      }),
    ).toThrow(/OAK_ALLOW_DEMO_SEED/);
  });

  it("fails fatally when OAK_ENABLE_LIVE_PAYMENTS=true outside production", () => {
    expect(() =>
      parseEnv({
        ...baseLocalEnv,
        OAK_ENABLE_LIVE_PAYMENTS: "true",
      }),
    ).toThrow(/FATAL/);

    expect(() =>
      parseEnv({
        ...baseDeployedEnv,
        APP_ENV: "staging",
        OAK_ENABLE_LIVE_PAYMENTS: "true",
      }),
    ).toThrow(/FATAL/);
  });

  it("fails fatally when sk_live_ or pk_live_ is used in local, staging or unauthorized production", () => {
    expect(() =>
      parseEnv({
        ...baseLocalEnv,
        STRIPE_SECRET_KEY: syntheticLiveSecretKey,
      }),
    ).toThrow(/FATAL/);

    expect(() =>
      parseEnv({
        ...baseDeployedEnv,
        APP_ENV: "staging",
        STRIPE_SECRET_KEY: syntheticLiveSecretKey,
      }),
    ).toThrow(/FATAL/);

    expect(() =>
      parseEnv({
        ...baseDeployedEnv,
        APP_ENV: "staging",
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: syntheticLivePublishableKey,
      }),
    ).toThrow(/FATAL/);

    expect(() =>
      parseEnv({
        ...baseDeployedEnv,
        APP_ENV: "production",
        OAK_ENABLE_LIVE_PAYMENTS: "false",
        STRIPE_SECRET_KEY: syntheticLiveSecretKey,
      }),
    ).toThrow(/FATAL/);

    expect(() =>
      parseEnv({
        ...baseLocalEnv,
        STRIPE_SECRET_KEY: `  ${syntheticLiveSecretKey} `,
      }),
    ).toThrow(/FATAL/);

    expect(() =>
      parseEnv({
        ...baseDeployedEnv,
        APP_ENV: "staging",
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ` ${syntheticLivePublishableKey}`,
      }),
    ).toThrow(/FATAL/);

    expect(() =>
      parseEnv({
        ...baseLocalEnv,
        STRIPE_SECRET_KEY: syntheticLiveRestrictedKey,
      }),
    ).toThrow(/FATAL/);

    expect(() =>
      parseEnv({
        ...baseDeployedEnv,
        APP_ENV: "staging",
        STRIPE_SECRET_KEY: ` ${syntheticLiveRestrictedKey}`,
      }),
    ).toThrow(/FATAL/);

    expect(() =>
      parseEnv({
        ...baseDeployedEnv,
        APP_ENV: "production",
        OAK_ENABLE_LIVE_PAYMENTS: "false",
        STRIPE_SECRET_KEY: syntheticLiveRestrictedKey,
      }),
    ).toThrow(/FATAL/);
  });

  it("permits live Stripe keys only when APP_ENV=production and OAK_ENABLE_LIVE_PAYMENTS=true", () => {
    const liveProd = parseEnv({
      ...baseDeployedEnv,
      APP_ENV: "production",
      OAK_ENABLE_LIVE_PAYMENTS: "true",
      STRIPE_SECRET_KEY: syntheticLiveSecretKey,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: syntheticLivePublishableKey,
    });

    expect(liveProd.APP_ENV).toBe("production");
    expect(liveProd.OAK_ENABLE_LIVE_PAYMENTS).toBe("true");
  });
});
