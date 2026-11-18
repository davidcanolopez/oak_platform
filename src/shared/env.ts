import { z } from "zod";

export type AppEnv = "local" | "preview" | "staging" | "production";

const booleanFlagSchema = z.enum(["true", "false"]);
const nonEmptyString = z.string().trim().min(1);
const urlString = z.url();

const commonOptionalFields = {
  MIGRATION_DATABASE_URL: nonEmptyString.optional(),
  G3_DB_MODE: z.enum(["pglite-dev", "ephemeral-pg-url"]).optional(),
  G3_TEST_DATABASE_URL: nonEmptyString.optional(),
  SENTRY_AUTH_TOKEN: nonEmptyString.optional(),
};

const localEnvSchema = z.object({
  APP_ENV: z.literal("local"),
  NEXT_PUBLIC_APP_URL: urlString.optional().default("http://127.0.0.1:3000"),
  DATABASE_URL: nonEmptyString,
  NEXT_PUBLIC_SUPABASE_URL: urlString,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: nonEmptyString,
  SUPABASE_SERVICE_ROLE_KEY: nonEmptyString.optional(),
  STRIPE_SECRET_KEY: nonEmptyString.optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: nonEmptyString.optional(),
  STRIPE_WEBHOOK_SECRET: nonEmptyString.optional(),
  OAK_ENABLE_LIVE_PAYMENTS: booleanFlagSchema.optional().default("false"),
  OAK_ALLOW_DEMO_SEED: booleanFlagSchema.optional().default("false"),
  RESEND_API_KEY: nonEmptyString.optional(),
  OAK_EMAIL_FROM: nonEmptyString.optional(),
  SENTRY_DSN: urlString.optional(),
  ...commonOptionalFields,
});

const deployedRequiredFields = {
  NEXT_PUBLIC_APP_URL: urlString,
  DATABASE_URL: nonEmptyString,
  NEXT_PUBLIC_SUPABASE_URL: urlString,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: nonEmptyString,
  SUPABASE_SERVICE_ROLE_KEY: nonEmptyString,
  STRIPE_SECRET_KEY: nonEmptyString,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: nonEmptyString,
  STRIPE_WEBHOOK_SECRET: nonEmptyString,
  OAK_ENABLE_LIVE_PAYMENTS: booleanFlagSchema.optional().default("false"),
  RESEND_API_KEY: nonEmptyString,
  OAK_EMAIL_FROM: nonEmptyString,
  SENTRY_DSN: urlString,
  ...commonOptionalFields,
};

const previewEnvSchema = z.object({
  APP_ENV: z.literal("preview"),
  OAK_ALLOW_DEMO_SEED: booleanFlagSchema.optional().default("false"),
  ...deployedRequiredFields,
});

const stagingEnvSchema = z.object({
  APP_ENV: z.literal("staging"),
  OAK_ALLOW_DEMO_SEED: booleanFlagSchema.optional().default("false"),
  ...deployedRequiredFields,
});

const productionEnvSchema = z.object({
  APP_ENV: z.literal("production"),
  OAK_ALLOW_DEMO_SEED: z.literal("false").optional().default("false"),
  ...deployedRequiredFields,
});

export const oakEnvSchema = z.discriminatedUnion("APP_ENV", [
  localEnvSchema,
  previewEnvSchema,
  stagingEnvSchema,
  productionEnvSchema,
]);

export type OakEnv = z.infer<typeof oakEnvSchema>;
export type RawEnvInput = Record<string, string | undefined>;

function assertNoAccidentalLivePayments(rawEnv: RawEnvInput): void {
  const appEnv = rawEnv.APP_ENV;
  const livePaymentsFlag = rawEnv.OAK_ENABLE_LIVE_PAYMENTS;
  const stripeSecret = rawEnv.STRIPE_SECRET_KEY ?? "";
  const stripePublishable = rawEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
  const isAuthorizedLiveProduction = appEnv === "production" && livePaymentsFlag === "true";

  if (livePaymentsFlag === "true" && appEnv !== "production") {
    throw new Error(
      "FATAL: OAK_ENABLE_LIVE_PAYMENTS=true is forbidden outside APP_ENV=production.",
    );
  }

  if (
    !isAuthorizedLiveProduction &&
    (stripeSecret.startsWith("sk_live_") || stripePublishable.startsWith("pk_live_"))
  ) {
    throw new Error(
      "FATAL: Live Stripe keys (sk_live_/pk_live_) are forbidden unless APP_ENV=production and OAK_ENABLE_LIVE_PAYMENTS=true.",
    );
  }
}

export function parseEnv(rawEnv: RawEnvInput = process.env): OakEnv {
  if (!rawEnv || typeof rawEnv !== "object") {
    throw new Error("Invalid or missing environment configuration for fields: APP_ENV");
  }

  assertNoAccidentalLivePayments(rawEnv);

  const result = oakEnvSchema.safeParse(rawEnv);
  if (!result.success) {
    const invalidFields = Array.from(
      new Set(result.error.issues.map((issue) => issue.path.join("."))),
    ).sort();
    throw new Error(
      `Invalid or missing environment configuration for fields: ${invalidFields.join(", ")}`,
    );
  }

  return result.data;
}

export function getServerEnv(rawEnv: RawEnvInput = process.env): OakEnv {
  return parseEnv(rawEnv);
}
