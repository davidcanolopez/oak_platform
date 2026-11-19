import { z } from "zod";

export const DISCIPLINES = ["trail", "running"] as const;
export const EVENT_STATUSES = ["DRAFT", "PUBLISHED", "CLOSED", "CANCELLED", "COMPLETED"] as const;
export const EVENT_LEVELS = ["INICIACION", "MEDIO", "AVANZADO"] as const;
export const MEMBERSHIP_STATUSES = ["INVITED", "ACTIVE", "REVOKED"] as const;
export const ORG_ROLES = ["ORG_OWNER", "ORG_MANAGER", "ORG_VIEWER"] as const;
export const PLATFORM_ROLES = ["ATHLETE", "ADMIN"] as const;
export const REGISTRATION_STATUSES = [
  "DRAFT",
  "PENDING_PAYMENT",
  "CONFIRMED",
  "CANCELLED",
  "REFUNDED",
] as const;
export const PAYMENT_STATUSES = [
  "CREATED",
  "REQUIRES_ACTION",
  "SUCCEEDED",
  "FAILED",
  "REFUNDED",
] as const;
export const DEMO_ACCOUNT_KINDS = [
  "athlete-history",
  "athlete-new",
  "organizer-active",
  "organizer-invited",
  "organizer-revoked",
  "admin",
] as const;

export const EXPECTED_ORGANIZATION_COUNT = 2;
export const EXPECTED_EVENT_COUNT = 12;
export const EXPECTED_TIMEZONE = "Europe/Madrid";
export const EXPECTED_REGION = "Comunidad de Madrid";
export const EXPECTED_CURRENCY = "EUR";
export const REQUIRED_EMAIL_SUFFIX = ".invalid";

export const BANNED_DECK_TERMS = [
  "david cano",
  "trail del robledal",
  "pedales de guadarrama",
  "10k madrid rio",
  "sierra norte trail",
  "oak.run",
  "explorer",
  "pathfinder",
] as const;

const MADRID_MUNICIPALITIES_RAW = [
  "alcala de henares",
  "alcobendas",
  "alcorcon",
  "alpedrete",
  "aranjuez",
  "arganda del rey",
  "becerril de la sierra",
  "boadilla del monte",
  "buitrago del lozoya",
  "bustarviejo",
  "cercedilla",
  "chinchon",
  "ciempozuelos",
  "collado mediano",
  "collado villalba",
  "colmenar viejo",
  "coslada",
  "el boalo",
  "el escorial",
  "fuenlabrada",
  "galapagar",
  "getafe",
  "guadarrama",
  "hoyo de manzanares",
  "las rozas de madrid",
  "leganes",
  "los molinos",
  "lozoya",
  "madrid",
  "majadahonda",
  "manzanares el real",
  "mejorada del campo",
  "miraflores de la sierra",
  "moralzarzal",
  "mostoles",
  "navacerrada",
  "navalcarnero",
  "paracuellos de jarama",
  "parla",
  "patones",
  "pinto",
  "pozuelo de alarcon",
  "rascafria",
  "rivas-vaciamadrid",
  "san lorenzo de el escorial",
  "san martin de valdeiglesias",
  "san sebastian de los reyes",
  "soto del real",
  "torrejon de ardoz",
  "torrelodones",
  "tres cantos",
  "valdemorillo",
  "valdemoro",
  "villanueva de la canada",
  "villaviciosa de odon",
] as const;

const MADRID_MUNICIPALITIES = new Set<string>(MADRID_MUNICIPALITIES_RAW);

const UTC_ISO_SECONDS_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const UTC_ISO_MILLIS_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const KEBAB_CHARSET_REGEX = /^[a-z0-9-]+$/;
const SHA256_HEX_REGEX = /^[0-9a-f]{64}$/;
const REGISTRATION_CODE_REGEX = /^OAK-DEMO-\d{4}-\d{4}$/;

export function normalizeComparisonText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function isStrictUtcIsoTimestamp(value: string): boolean {
  if (!UTC_ISO_SECONDS_REGEX.test(value) && !UTC_ISO_MILLIS_REGEX.test(value)) {
    return false;
  }
  const parsedMs = Date.parse(value);
  if (Number.isNaN(parsedMs)) {
    return false;
  }
  const canonicalPrefix = new Date(parsedMs).toISOString().slice(0, 19);
  return value.slice(0, 19) === canonicalPrefix;
}

function isKebabSlug(value: string): boolean {
  return (
    KEBAB_CHARSET_REGEX.test(value) &&
    !value.startsWith("-") &&
    !value.endsWith("-") &&
    !value.includes("--")
  );
}

const nonEmptyTextSchema = z.string().trim().min(1);

const slugSchema = z
  .string()
  .trim()
  .min(3)
  .max(100)
  .refine(isKebabSlug, "Slug must be lowercase kebab-case.");

const utcTimestampSchema = z
  .string()
  .refine(isStrictUtcIsoTimestamp, "Timestamp must be valid ISO 8601 UTC ending with 'Z'.");

const reservedInvalidEmailSchema = z
  .email()
  .refine((value) => value.toLowerCase().endsWith(REQUIRED_EMAIL_SUFFIX), {
    message: "Email must use an RFC 2606 .invalid reserved domain.",
  });

const madridMunicipalitySchema = nonEmptyTextSchema.refine(
  (value) => MADRID_MUNICIPALITIES.has(normalizeComparisonText(value)),
  {
    message: "Municipality must belong to the Community of Madrid allowlist.",
  },
);

const minorUnitsCentsSchema = z.number().int().nonnegative();

const priceTierSchema = z.strictObject({
  id: z.uuid(),
  label: nonEmptyTextSchema,
  amountCents: minorUnitsCentsSchema,
  managementFeeCents: minorUnitsCentsSchema,
  totalCents: minorUnitsCentsSchema,
  currency: z.literal(EXPECTED_CURRENCY),
  validFromUtc: utcTimestampSchema,
  validUntilUtc: utcTimestampSchema,
  maxQuantity: z.number().int().positive(),
});

const eventModalitySchema = z.strictObject({
  id: z.uuid(),
  name: nonEmptyTextSchema,
  distanceMeters: z.number().int().positive(),
  elevationGainMeters: z.number().int().nonnegative(),
  level: z.enum(EVENT_LEVELS),
  timeLimitMinutes: z.number().int().positive(),
  capacityLimit: z.number().int().positive(),
  reservedCount: z.number().int().nonnegative(),
  remainingSpots: z.number().int().nonnegative(),
  priceTiers: z.array(priceTierSchema).min(1),
});

const eventSchema = z.strictObject({
  id: z.uuid(),
  organizationId: z.uuid(),
  slug: slugSchema,
  title: nonEmptyTextSchema,
  discipline: z.enum(DISCIPLINES),
  status: z.enum(EVENT_STATUSES),
  region: z.literal(EXPECTED_REGION),
  municipality: madridMunicipalitySchema,
  locationName: nonEmptyTextSchema,
  startsAtUtc: utcTimestampSchema,
  registrationClosesAtUtc: utcTimestampSchema,
  timezone: z.literal(EXPECTED_TIMEZONE),
  regulationSummary: nonEmptyTextSchema,
  cancellationPolicySummary: nonEmptyTextSchema,
  publicContactEmail: reservedInvalidEmailSchema,
  modalities: z.array(eventModalitySchema).min(1),
});

const organizationSchema = z.strictObject({
  id: z.uuid(),
  slug: slugSchema,
  displayName: nonEmptyTextSchema,
  region: z.literal(EXPECTED_REGION),
  municipality: madridMunicipalitySchema,
  publicDescription: nonEmptyTextSchema,
  publicContactEmail: reservedInvalidEmailSchema,
  status: z.literal("ACTIVE"),
});

const organizationMembershipSchema = z.strictObject({
  id: z.uuid(),
  organizationId: z.uuid(),
  userId: z.uuid().nullable(),
  orgRole: z.enum(ORG_ROLES),
  status: z.enum(MEMBERSHIP_STATUSES),
  invitedEmail: reservedInvalidEmailSchema.nullable(),
  invitationTokenHash: z.string().regex(SHA256_HEX_REGEX).nullable(),
  invitationExpiresAtUtc: utcTimestampSchema.nullable(),
  acceptedAtUtc: utcTimestampSchema.nullable(),
  revokedAtUtc: utcTimestampSchema.nullable(),
});

const athleteProfileSchema = z.strictObject({
  fullName: nonEmptyTextSchema,
  preferredDisciplines: z.array(z.enum(DISCIPLINES)).min(1),
  preferredLevel: z.enum(EVENT_LEVELS),
  municipality: madridMunicipalitySchema,
});

const demoAccountSchema = z.strictObject({
  id: z.uuid(),
  accountKey: slugSchema,
  kind: z.enum(DEMO_ACCOUNT_KINDS),
  platformRole: z.enum(PLATFORM_ROLES),
  mfaRequired: z.boolean(),
  email: reservedInvalidEmailSchema,
  displayName: nonEmptyTextSchema,
  credentialPolicy: z.literal("NO_PASSWORD_IN_REPO_EPHEMERAL_DEV_ONLY"),
  athleteProfile: athleteProfileSchema.nullable(),
  consentVersion: nonEmptyTextSchema.nullable(),
});

const favouriteSchema = z.strictObject({
  userId: z.uuid(),
  eventId: z.uuid(),
  createdAtUtc: utcTimestampSchema,
});

const registrationParticipantSchema = z.strictObject({
  id: z.uuid(),
  fullName: nonEmptyTextSchema,
  email: reservedInvalidEmailSchema,
  clubOrTeam: nonEmptyTextSchema.nullable(),
  documentNumber: z.null(),
});

const registrationSchema = z.strictObject({
  id: z.uuid(),
  registrationCode: z.string().regex(REGISTRATION_CODE_REGEX),
  userId: z.uuid(),
  eventId: z.uuid(),
  eventModalityId: z.uuid(),
  priceTierId: z.uuid(),
  status: z.enum(REGISTRATION_STATUSES),
  unitAmountCents: minorUnitsCentsSchema,
  feeCents: minorUnitsCentsSchema,
  totalCents: minorUnitsCentsSchema,
  currency: z.literal(EXPECTED_CURRENCY),
  createdAtUtc: utcTimestampSchema,
  updatedAtUtc: utcTimestampSchema,
  confirmedAtUtc: utcTimestampSchema.nullable(),
  participant: registrationParticipantSchema,
});

const paymentSchema = z.strictObject({
  id: z.uuid(),
  registrationId: z.uuid(),
  provider: z.literal("stripe_test"),
  mode: z.literal("test"),
  status: z.enum(PAYMENT_STATUSES),
  amountCents: minorUnitsCentsSchema,
  currency: z.literal(EXPECTED_CURRENCY),
  idempotencyKey: nonEmptyTextSchema,
  providerSessionRef: nonEmptyTextSchema,
  providerIntentRef: nonEmptyTextSchema.nullable(),
  createdAtUtc: utcTimestampSchema,
  succeededAtUtc: utcTimestampSchema.nullable(),
  refundedAtUtc: utcTimestampSchema.nullable(),
});

export const syntheticDatasetSchema = z.strictObject({
  schemaVersion: z.literal("1.0.0"),
  datasetId: z.literal("oak-seed.v1"),
  generatedAtUtc: utcTimestampSchema,
  defaultTimezone: z.literal(EXPECTED_TIMEZONE),
  defaultCurrency: z.literal(EXPECTED_CURRENCY),
  safetyGuard: z.strictObject({
    requiresAllowDemoSeed: z.literal(true),
    forbiddenInProduction: z.literal(true),
    containsRealPii: z.literal(false),
    allowedEmailSuffix: z.literal(REQUIRED_EMAIL_SUFFIX),
  }),
  organizations: z.array(organizationSchema).length(EXPECTED_ORGANIZATION_COUNT),
  memberships: z.array(organizationMembershipSchema).min(3),
  demoAccounts: z.array(demoAccountSchema).min(6),
  events: z.array(eventSchema).length(EXPECTED_EVENT_COUNT),
  favourites: z.array(favouriteSchema),
  registrations: z.array(registrationSchema).min(1),
  payments: z.array(paymentSchema).min(1),
});

export type SyntheticDataset = z.infer<typeof syntheticDatasetSchema>;
export type SyntheticOrganization = z.infer<typeof organizationSchema>;
export type SyntheticMembership = z.infer<typeof organizationMembershipSchema>;
export type SyntheticDemoAccount = z.infer<typeof demoAccountSchema>;
export type SyntheticEvent = z.infer<typeof eventSchema>;
export type SyntheticEventModality = z.infer<typeof eventModalitySchema>;
export type SyntheticPriceTier = z.infer<typeof priceTierSchema>;
export type SyntheticRegistration = z.infer<typeof registrationSchema>;
export type SyntheticPayment = z.infer<typeof paymentSchema>;

export interface SyntheticValidationReport {
  datasetId: string;
  schemaVersion: string;
  status: "VALID";
  organizationCount: number;
  membershipCount: number;
  demoAccountCount: number;
  eventCount: number;
  modalityCount: number;
  priceTierCount: number;
  registrationCount: number;
  paymentCount: number;
  favouriteCount: number;
  disciplines: Record<(typeof DISCIPLINES)[number], number>;
  eventStatuses: Record<(typeof EVENT_STATUSES)[number], number>;
  membershipStatuses: Record<(typeof MEMBERSHIP_STATUSES)[number], number>;
  registrationStatuses: Record<(typeof REGISTRATION_STATUSES)[number], number>;
  paymentStatuses: Record<(typeof PAYMENT_STATUSES)[number], number>;
  edgeCases: {
    hasSoldOutPublishedModality: boolean;
    hasLastSpotPublishedModality: boolean;
    hasNormalCapacityPublishedModality: boolean;
    hasFreeZeroEurTier: boolean;
    hasMultiTierModality: boolean;
    hasNewAthleteWithoutChallenges: boolean;
    hasHistoryAthleteWithCompletedEvents: boolean;
  };
  safetyInvariants: {
    allTimestampsUtcZ: boolean;
    allTimezonesEuropeMadrid: boolean;
    allAmountsIntegerEurCents: boolean;
    allEmailsReservedInvalid: boolean;
    bannedDeckDataMatches: number;
  };
}

function findBannedTermInString(text: string): string | null {
  const normalized = normalizeComparisonText(text);
  for (const bannedTerm of BANNED_DECK_TERMS) {
    if (normalized.includes(bannedTerm)) {
      return bannedTerm;
    }
  }
  return null;
}

function scanBannedMockValue(value: unknown, path: string, seen: WeakSet<object>): void {
  if (typeof value === "string") {
    const matched = findBannedTermInString(value);
    if (matched !== null) {
      throw new Error(`Banned deck mock data "${matched}" detected at ${path}.`);
    }
    return;
  }

  if (typeof value !== "object" || value === null || seen.has(value)) {
    return;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) {
      scanBannedMockValue(item, `${path}[${String(index)}]`, seen);
    }
    return;
  }

  for (const [key, nestedValue] of Object.entries(value)) {
    const keyMatch = findBannedTermInString(key);
    if (keyMatch !== null) {
      throw new Error(`Banned deck mock data "${keyMatch}" detected in key at ${path}.${key}.`);
    }
    scanBannedMockValue(nestedValue, `${path}.${key}`, seen);
  }
}

export function assertNoBannedMockData(raw: unknown): void {
  scanBannedMockValue(raw, "$", new WeakSet<object>());
}

function assertUniqueIdentifier(seen: Set<string>, value: string, entityLabel: string): void {
  if (seen.has(value)) {
    throw new Error(`Duplicate ${entityLabel} detected: ${value}`);
  }
  seen.add(value);
}

function assertDatasetInvariants(dataset: SyntheticDataset): void {
  const orgIds = new Set<string>();
  const orgSlugs = new Set<string>();
  for (const org of dataset.organizations) {
    assertUniqueIdentifier(orgIds, org.id, "organization.id");
    assertUniqueIdentifier(orgSlugs, org.slug, "organization.slug");
  }

  const accountIds = new Set<string>();
  const accountKeys = new Set<string>();
  const accountEmails = new Set<string>();
  const accountById = new Map<string, SyntheticDemoAccount>();
  let hasHistoryAthlete = false;
  let hasNewAthlete = false;
  let hasAdmin = false;

  for (const account of dataset.demoAccounts) {
    assertUniqueIdentifier(accountIds, account.id, "demoAccount.id");
    assertUniqueIdentifier(accountKeys, account.accountKey, "demoAccount.accountKey");
    assertUniqueIdentifier(accountEmails, account.email.toLowerCase(), "demoAccount.email");
    accountById.set(account.id, account);

    if (account.kind === "athlete-history") {
      if (account.platformRole !== "ATHLETE") {
        throw new Error(`Account ${account.accountKey} must have platformRole ATHLETE.`);
      }
      hasHistoryAthlete = true;
    }
    if (account.kind === "athlete-new") {
      if (account.platformRole !== "ATHLETE") {
        throw new Error(`Account ${account.accountKey} must have platformRole ATHLETE.`);
      }
      hasNewAthlete = true;
    }
    if (account.kind === "admin") {
      if (account.platformRole !== "ADMIN" || !account.mfaRequired) {
        throw new Error(
          `Admin account ${account.accountKey} must enforce ADMIN + mfaRequired=true.`,
        );
      }
      hasAdmin = true;
    }
  }

  if (!hasHistoryAthlete || !hasNewAthlete || !hasAdmin) {
    throw new Error("Dataset must include athlete-history, athlete-new and admin demo accounts.");
  }

  const membershipIds = new Set<string>();
  const membershipStatusSet = new Set<string>();
  const activeOrgIds = new Set<string>();

  for (const membership of dataset.memberships) {
    assertUniqueIdentifier(membershipIds, membership.id, "membership.id");
    if (!orgIds.has(membership.organizationId)) {
      throw new Error(`Membership ${membership.id} references unknown organization.`);
    }
    membershipStatusSet.add(membership.status);

    if (membership.status === "INVITED") {
      if (
        membership.userId !== null ||
        membership.invitedEmail === null ||
        membership.invitationTokenHash === null ||
        membership.invitationExpiresAtUtc === null
      ) {
        throw new Error(
          `INVITED membership ${membership.id} must have userId=null, invitedEmail, tokenHash and expiry.`,
        );
      }
    } else {
      if (membership.userId === null || !accountIds.has(membership.userId)) {
        throw new Error(`Membership ${membership.id} must reference a valid demoAccount userId.`);
      }
      if (membership.invitedEmail !== null || membership.invitationTokenHash !== null) {
        throw new Error(
          `Non-INVITED membership ${membership.id} must clear invitedEmail and invitationTokenHash.`,
        );
      }
      if (membership.status === "ACTIVE") {
        activeOrgIds.add(membership.organizationId);
      }
    }
  }

  for (const requiredStatus of MEMBERSHIP_STATUSES) {
    if (!membershipStatusSet.has(requiredStatus)) {
      throw new Error(`Dataset missing required membership status: ${requiredStatus}`);
    }
  }
  for (const orgId of orgIds) {
    if (!activeOrgIds.has(orgId)) {
      throw new Error(`Organization ${orgId} must have at least one ACTIVE membership.`);
    }
  }

  const eventIds = new Set<string>();
  const eventSlugs = new Set<string>();
  const modalityIds = new Set<string>();
  const priceTierIds = new Set<string>();
  const eventById = new Map<string, SyntheticEvent>();
  const modalityById = new Map<string, { eventId: string; modality: SyntheticEventModality }>();
  const tierById = new Map<
    string,
    { eventId: string; modalityId: string; tier: SyntheticPriceTier }
  >();

  const seenDisciplines = new Set<string>();
  const seenEventStatuses = new Set<string>();
  const orgEventCounts = new Map<string, number>();

  let hasSoldOutPublished = false;
  let hasLastSpotPublished = false;
  let hasNormalCapacityPublished = false;
  let hasFreeZeroEurTier = false;
  let hasMultiTierModality = false;

  for (const event of dataset.events) {
    assertUniqueIdentifier(eventIds, event.id, "event.id");
    assertUniqueIdentifier(eventSlugs, event.slug, "event.slug");
    if (!orgIds.has(event.organizationId)) {
      throw new Error(`Event ${event.slug} references unknown organizationId.`);
    }
    if (Date.parse(event.registrationClosesAtUtc) > Date.parse(event.startsAtUtc)) {
      throw new Error(`Event ${event.slug} registrationClosesAtUtc cannot exceed startsAtUtc.`);
    }

    eventById.set(event.id, event);
    seenDisciplines.add(event.discipline);
    seenEventStatuses.add(event.status);
    orgEventCounts.set(event.organizationId, (orgEventCounts.get(event.organizationId) ?? 0) + 1);

    for (const modality of event.modalities) {
      assertUniqueIdentifier(modalityIds, modality.id, "modality.id");
      if (modality.reservedCount > modality.capacityLimit) {
        throw new Error(
          `Modality ${modality.id} exceeds capacityLimit (${String(modality.reservedCount)} > ${String(modality.capacityLimit)}).`,
        );
      }
      const expectedRemaining = modality.capacityLimit - modality.reservedCount;
      if (modality.remainingSpots !== expectedRemaining) {
        throw new Error(
          `Modality ${modality.id} remainingSpots (${String(modality.remainingSpots)}) must equal capacityLimit - reservedCount (${String(expectedRemaining)}).`,
        );
      }
      modalityById.set(modality.id, { eventId: event.id, modality });

      if (event.status === "PUBLISHED") {
        if (modality.remainingSpots === 0) {
          hasSoldOutPublished = true;
        } else if (modality.remainingSpots === 1) {
          hasLastSpotPublished = true;
        } else if (modality.remainingSpots >= 10) {
          hasNormalCapacityPublished = true;
        }
      }

      if (modality.priceTiers.length >= 2) {
        hasMultiTierModality = true;
      }

      for (const tier of modality.priceTiers) {
        assertUniqueIdentifier(priceTierIds, tier.id, "priceTier.id");
        if (Date.parse(tier.validFromUtc) > Date.parse(tier.validUntilUtc)) {
          throw new Error(`PriceTier ${tier.id} validFromUtc cannot exceed validUntilUtc.`);
        }
        if (tier.maxQuantity > modality.capacityLimit) {
          throw new Error(`PriceTier ${tier.id} maxQuantity cannot exceed modality capacityLimit.`);
        }
        if (tier.totalCents !== tier.amountCents + tier.managementFeeCents) {
          throw new Error(
            `PriceTier ${tier.id} totalCents must equal amountCents + managementFeeCents.`,
          );
        }
        if (event.status === "PUBLISHED" && tier.amountCents === 0 && tier.totalCents === 0) {
          hasFreeZeroEurTier = true;
        }
        tierById.set(tier.id, { eventId: event.id, modalityId: modality.id, tier });
      }
    }
  }

  for (const discipline of DISCIPLINES) {
    if (!seenDisciplines.has(discipline)) {
      throw new Error(`Dataset missing required discipline: ${discipline}`);
    }
  }
  for (const status of EVENT_STATUSES) {
    if (!seenEventStatuses.has(status)) {
      throw new Error(`Dataset missing required event status: ${status}`);
    }
  }
  for (const orgId of orgIds) {
    if ((orgEventCounts.get(orgId) ?? 0) < 1) {
      throw new Error(`Organization ${orgId} must own at least one event.`);
    }
  }

  if (!hasSoldOutPublished) {
    throw new Error("Dataset must include at least one PUBLISHED modality with remainingSpots=0.");
  }
  if (!hasLastSpotPublished) {
    throw new Error("Dataset must include at least one PUBLISHED modality with remainingSpots=1.");
  }
  if (!hasNormalCapacityPublished) {
    throw new Error(
      "Dataset must include at least one PUBLISHED modality with remainingSpots>=10.",
    );
  }
  if (!hasFreeZeroEurTier) {
    throw new Error("Dataset must include at least one PUBLISHED free modality (0 EUR cents).");
  }
  if (!hasMultiTierModality) {
    throw new Error("Dataset must include at least one modality with multiple price tiers.");
  }

  const favouritePairs = new Set<string>();
  const newAthleteIds = new Set(
    dataset.demoAccounts.filter((acc) => acc.kind === "athlete-new").map((acc) => acc.id),
  );
  const historyAthleteIds = new Set(
    dataset.demoAccounts.filter((acc) => acc.kind === "athlete-history").map((acc) => acc.id),
  );

  for (const fav of dataset.favourites) {
    if (!accountIds.has(fav.userId) || !eventIds.has(fav.eventId)) {
      throw new Error("Favourite references unknown userId or eventId.");
    }
    if (newAthleteIds.has(fav.userId)) {
      throw new Error("New athlete demo account must not have pre-existing favourites.");
    }
    assertUniqueIdentifier(
      favouritePairs,
      `${fav.userId}:${fav.eventId}`,
      "favourite(userId,eventId)",
    );
  }

  const registrationIds = new Set<string>();
  const registrationCodes = new Set<string>();
  const activeModalitiesPerUser = new Set<string>();
  const registrationById = new Map<string, SyntheticRegistration>();
  const seenRegistrationStatuses = new Set<string>();
  let historyAthleteHasCompletedEvent = false;

  for (const reg of dataset.registrations) {
    assertUniqueIdentifier(registrationIds, reg.id, "registration.id");
    assertUniqueIdentifier(
      registrationCodes,
      reg.registrationCode,
      "registration.registrationCode",
    );
    const account = accountById.get(reg.userId);
    if (!account || account.platformRole !== "ATHLETE") {
      throw new Error(`Registration ${reg.id} must belong to an ATHLETE demo account.`);
    }
    if (newAthleteIds.has(reg.userId)) {
      throw new Error("New athlete demo account must have zero registrations.");
    }

    const event = eventById.get(reg.eventId);
    const modalityRef = modalityById.get(reg.eventModalityId);
    const tierRef = tierById.get(reg.priceTierId);
    if (!event || !modalityRef || !tierRef) {
      throw new Error(`Registration ${reg.id} references missing event, modality or priceTier.`);
    }
    if (modalityRef.eventId !== event.id || tierRef.modalityId !== modalityRef.modality.id) {
      throw new Error(`Registration ${reg.id} has inconsistent event/modality/tier hierarchy.`);
    }
    if (
      reg.unitAmountCents !== tierRef.tier.amountCents ||
      reg.feeCents !== tierRef.tier.managementFeeCents ||
      reg.totalCents !== reg.unitAmountCents + reg.feeCents
    ) {
      throw new Error(`Registration ${reg.id} amounts do not match authoritative PriceTier.`);
    }

    if (reg.status === "CONFIRMED" || reg.status === "PENDING_PAYMENT") {
      assertUniqueIdentifier(
        activeModalitiesPerUser,
        `${reg.userId}:${reg.eventModalityId}`,
        "active registration(userId,modalityId)",
      );
    }
    if (reg.status === "CONFIRMED" && reg.confirmedAtUtc === null) {
      throw new Error(`CONFIRMED registration ${reg.id} must define confirmedAtUtc.`);
    }
    if (
      historyAthleteIds.has(reg.userId) &&
      reg.status === "CONFIRMED" &&
      event.status === "COMPLETED"
    ) {
      historyAthleteHasCompletedEvent = true;
    }

    seenRegistrationStatuses.add(reg.status);
    registrationById.set(reg.id, reg);
  }

  if (!historyAthleteHasCompletedEvent) {
    throw new Error(
      "History athlete demo account must have at least one CONFIRMED registration on a COMPLETED event.",
    );
  }
  for (const regStatus of REGISTRATION_STATUSES) {
    if (!seenRegistrationStatuses.has(regStatus)) {
      throw new Error(`Dataset missing required registration status: ${regStatus}`);
    }
  }

  const paymentIds = new Set<string>();
  const paymentIdempotencyKeys = new Set<string>();
  const paymentByRegistrationId = new Map<string, SyntheticPayment>();
  const seenPaymentStatuses = new Set<string>();

  for (const payment of dataset.payments) {
    assertUniqueIdentifier(paymentIds, payment.id, "payment.id");
    assertUniqueIdentifier(
      paymentIdempotencyKeys,
      payment.idempotencyKey,
      "payment.idempotencyKey",
    );
    if (paymentByRegistrationId.has(payment.registrationId)) {
      throw new Error(`Duplicate payment for registration ${payment.registrationId}`);
    }
    const reg = registrationById.get(payment.registrationId);
    if (!reg) {
      throw new Error(`Payment ${payment.id} references unknown registrationId.`);
    }
    if (payment.amountCents !== reg.totalCents || payment.currency !== reg.currency) {
      throw new Error(`Payment ${payment.id} does not reconcile with registration totalCents.`);
    }
    seenPaymentStatuses.add(payment.status);
    paymentByRegistrationId.set(payment.registrationId, payment);
  }

  for (const paymentStatus of PAYMENT_STATUSES) {
    if (!seenPaymentStatuses.has(paymentStatus)) {
      throw new Error(`Dataset missing required payment status: ${paymentStatus}`);
    }
  }

  for (const reg of dataset.registrations) {
    const linkedPayment = paymentByRegistrationId.get(reg.id);
    if (reg.status === "CONFIRMED" && reg.totalCents > 0) {
      if (!linkedPayment || linkedPayment.status !== "SUCCEEDED") {
        throw new Error(
          `Paid CONFIRMED registration ${reg.id} must have a SUCCEEDED payment (INV-06).`,
        );
      }
    }
    if (reg.status === "REFUNDED") {
      if (!linkedPayment || linkedPayment.status !== "REFUNDED") {
        throw new Error(`REFUNDED registration ${reg.id} must have a REFUNDED payment.`);
      }
    }
  }
}

export function validateSyntheticDataset(raw: unknown): SyntheticDataset {
  assertNoBannedMockData(raw);

  const parsed = syntheticDatasetSchema.safeParse(raw);
  if (!parsed.success) {
    const issueSummary = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "$"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Synthetic dataset validation failed at ${issueSummary}`);
  }

  assertDatasetInvariants(parsed.data);
  return parsed.data;
}

function countByKey<T extends string>(keys: readonly T[], values: readonly T[]): Record<T, number> {
  return Object.fromEntries(
    keys.map((key) => [key, values.filter((value) => value === key).length]),
  ) as Record<T, number>;
}

function collectDatasetTimestamps(dataset: SyntheticDataset): string[] {
  const timestamps: string[] = [dataset.generatedAtUtc];

  for (const membership of dataset.memberships) {
    if (membership.invitationExpiresAtUtc !== null) {
      timestamps.push(membership.invitationExpiresAtUtc);
    }
    if (membership.acceptedAtUtc !== null) {
      timestamps.push(membership.acceptedAtUtc);
    }
    if (membership.revokedAtUtc !== null) {
      timestamps.push(membership.revokedAtUtc);
    }
  }

  for (const event of dataset.events) {
    timestamps.push(event.startsAtUtc, event.registrationClosesAtUtc);
    for (const modality of event.modalities) {
      for (const tier of modality.priceTiers) {
        timestamps.push(tier.validFromUtc, tier.validUntilUtc);
      }
    }
  }

  for (const fav of dataset.favourites) {
    timestamps.push(fav.createdAtUtc);
  }

  for (const reg of dataset.registrations) {
    timestamps.push(reg.createdAtUtc, reg.updatedAtUtc);
    if (reg.confirmedAtUtc !== null) {
      timestamps.push(reg.confirmedAtUtc);
    }
  }

  for (const payment of dataset.payments) {
    timestamps.push(payment.createdAtUtc);
    if (payment.succeededAtUtc !== null) {
      timestamps.push(payment.succeededAtUtc);
    }
    if (payment.refundedAtUtc !== null) {
      timestamps.push(payment.refundedAtUtc);
    }
  }

  return timestamps;
}

function collectDatasetEmails(dataset: SyntheticDataset): string[] {
  const emails: string[] = [
    ...dataset.organizations.map((org) => org.publicContactEmail),
    ...dataset.demoAccounts.map((acc) => acc.email),
    ...dataset.events.map((ev) => ev.publicContactEmail),
    ...dataset.registrations.map((reg) => reg.participant.email),
  ];

  for (const membership of dataset.memberships) {
    if (membership.invitedEmail !== null) {
      emails.push(membership.invitedEmail);
    }
  }

  return emails;
}

export function buildValidationReport(rawDataset: unknown): SyntheticValidationReport {
  const dataset = validateSyntheticDataset(rawDataset);
  const modalities = dataset.events.flatMap((event) => event.modalities);
  const priceTiers = modalities.flatMap((modality) => modality.priceTiers);
  const publishedModalities = dataset.events
    .filter((event) => event.status === "PUBLISHED")
    .flatMap((event) => event.modalities);
  const publishedTiers = publishedModalities.flatMap((modality) => modality.priceTiers);
  const timestamps = collectDatasetTimestamps(dataset);
  const emails = collectDatasetEmails(dataset);

  return {
    datasetId: dataset.datasetId,
    schemaVersion: dataset.schemaVersion,
    status: "VALID",
    organizationCount: dataset.organizations.length,
    membershipCount: dataset.memberships.length,
    demoAccountCount: dataset.demoAccounts.length,
    eventCount: dataset.events.length,
    modalityCount: modalities.length,
    priceTierCount: priceTiers.length,
    registrationCount: dataset.registrations.length,
    paymentCount: dataset.payments.length,
    favouriteCount: dataset.favourites.length,
    disciplines: countByKey(
      DISCIPLINES,
      dataset.events.map((event) => event.discipline),
    ),
    eventStatuses: countByKey(
      EVENT_STATUSES,
      dataset.events.map((event) => event.status),
    ),
    membershipStatuses: countByKey(
      MEMBERSHIP_STATUSES,
      dataset.memberships.map((membership) => membership.status),
    ),
    registrationStatuses: countByKey(
      REGISTRATION_STATUSES,
      dataset.registrations.map((reg) => reg.status),
    ),
    paymentStatuses: countByKey(
      PAYMENT_STATUSES,
      dataset.payments.map((payment) => payment.status),
    ),
    edgeCases: {
      hasSoldOutPublishedModality: publishedModalities.some((m) => m.remainingSpots === 0),
      hasLastSpotPublishedModality: publishedModalities.some((m) => m.remainingSpots === 1),
      hasNormalCapacityPublishedModality: publishedModalities.some((m) => m.remainingSpots >= 10),
      hasFreeZeroEurTier: publishedTiers.some((t) => t.amountCents === 0 && t.totalCents === 0),
      hasMultiTierModality: modalities.some((m) => m.priceTiers.length >= 2),
      hasNewAthleteWithoutChallenges: dataset.demoAccounts.some(
        (acc) =>
          acc.kind === "athlete-new" &&
          !dataset.registrations.some((reg) => reg.userId === acc.id) &&
          !dataset.favourites.some((fav) => fav.userId === acc.id),
      ),
      hasHistoryAthleteWithCompletedEvents: dataset.demoAccounts.some(
        (acc) =>
          acc.kind === "athlete-history" &&
          dataset.registrations.some(
            (reg) =>
              reg.userId === acc.id &&
              reg.status === "CONFIRMED" &&
              dataset.events.some((ev) => ev.id === reg.eventId && ev.status === "COMPLETED"),
          ),
      ),
    },
    safetyInvariants: {
      allTimestampsUtcZ: timestamps.every(isStrictUtcIsoTimestamp),
      allTimezonesEuropeMadrid:
        dataset.defaultTimezone === EXPECTED_TIMEZONE &&
        dataset.events.every((ev) => ev.timezone === EXPECTED_TIMEZONE),
      allAmountsIntegerEurCents:
        priceTiers.every(
          (tier) =>
            Number.isInteger(tier.amountCents) &&
            Number.isInteger(tier.managementFeeCents) &&
            Number.isInteger(tier.totalCents) &&
            tier.currency === EXPECTED_CURRENCY,
        ) &&
        dataset.registrations.every(
          (reg) =>
            Number.isInteger(reg.unitAmountCents) &&
            Number.isInteger(reg.feeCents) &&
            Number.isInteger(reg.totalCents) &&
            reg.currency === EXPECTED_CURRENCY,
        ) &&
        dataset.payments.every(
          (payment) =>
            Number.isInteger(payment.amountCents) && payment.currency === EXPECTED_CURRENCY,
        ),
      allEmailsReservedInvalid: emails.every((email) =>
        email.toLowerCase().endsWith(REQUIRED_EMAIL_SUFFIX),
      ),
      bannedDeckDataMatches: 0,
    },
  };
}
