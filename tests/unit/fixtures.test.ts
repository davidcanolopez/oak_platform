import { describe, expect, it } from "vitest";
import oakSeed from "../../data/fixtures/oak-seed.v1.json";
import {
  assertNoBannedMockData,
  buildValidationReport,
  type SyntheticDataset,
  validateSyntheticDataset,
} from "../../data/fixtures/schema";

function cloneDataset(): SyntheticDataset {
  return structuredClone(oakSeed) as SyntheticDataset;
}

function getAtOrThrow<T>(items: readonly T[], index: number, label: string): T {
  const item = items.at(index);
  if (item === undefined) {
    throw new Error(`Expected ${label} at index ${String(index)}`);
  }
  return item;
}

describe("P0-009 synthetic dataset validation (oak-seed.v1.json)", () => {
  it("validates oak-seed.v1.json deterministically with zero PII or banned deck data", () => {
    expect(() => assertNoBannedMockData(oakSeed)).not.toThrow();

    const first = validateSyntheticDataset(oakSeed);
    const second = validateSyntheticDataset(oakSeed);

    expect(first).toEqual(second);
    expect(first.organizations).toHaveLength(2);
    expect(first.events).toHaveLength(12);
    expect(first.events.every((event) => event.timezone === "Europe/Madrid")).toBe(true);
    expect(first.events.every((event) => event.region === "Comunidad de Madrid")).toBe(true);
    expect(first.events.every((event) => event.startsAtUtc.endsWith("Z"))).toBe(true);
    expect(first.demoAccounts.every((account) => account.email.endsWith("@oak-demo.invalid"))).toBe(
      true,
    );

    const report = buildValidationReport(first);
    expect(report.status).toBe("VALID");
    expect(report.disciplines).toEqual({ trail: 6, running: 6 });
    expect(report.eventStatuses).toEqual({
      DRAFT: 2,
      PUBLISHED: 6,
      CLOSED: 1,
      CANCELLED: 1,
      COMPLETED: 2,
    });
    expect(report.membershipStatuses).toEqual({
      INVITED: 1,
      ACTIVE: 3,
      REVOKED: 1,
    });
    expect(report.edgeCases).toEqual({
      hasSoldOutPublishedModality: true,
      hasLastSpotPublishedModality: true,
      hasNormalCapacityPublishedModality: true,
      hasFreeZeroEurTier: true,
      hasMultiTierModality: true,
      hasNewAthleteWithoutChallenges: true,
      hasHistoryAthleteWithCompletedEvents: true,
    });
    expect(report.safetyInvariants).toEqual({
      allTimestampsUtcZ: true,
      allTimezonesEuropeMadrid: true,
      allAmountsIntegerEurCents: true,
      allEmailsReservedInvalid: true,
      bannedDeckDataMatches: 0,
    });
  });

  it("rejects decimal or negative monetary amounts and non-EUR currency", () => {
    const floatPrice = cloneDataset();
    const firstModality = getAtOrThrow(
      getAtOrThrow(floatPrice.events, 0, "event").modalities,
      0,
      "modality",
    );
    const firstTier = getAtOrThrow(firstModality.priceTiers, 0, "priceTier");
    firstTier.amountCents = 24.99;
    firstTier.totalCents = 26.49;
    expect(() => validateSyntheticDataset(floatPrice)).toThrow();

    const negativePrice = cloneDataset();
    const negTier = getAtOrThrow(
      getAtOrThrow(getAtOrThrow(negativePrice.events, 0, "event").modalities, 0, "modality")
        .priceTiers,
      0,
      "priceTier",
    );
    negTier.amountCents = -100;
    expect(() => validateSyntheticDataset(negativePrice)).toThrow();

    const wrongCurrency = cloneDataset();
    const usdTier = getAtOrThrow(
      getAtOrThrow(getAtOrThrow(wrongCurrency.events, 0, "event").modalities, 0, "modality")
        .priceTiers,
      0,
      "priceTier",
    ) as { currency: string };
    usdTier.currency = "USD";
    expect(() => validateSyntheticDataset(wrongCurrency)).toThrow();
  });

  it("rejects non-UTC timestamps without trailing Z, invalid calendar dates and non-Madrid timezones", () => {
    const offsetTimestamp = cloneDataset();
    getAtOrThrow(offsetTimestamp.events, 0, "event").startsAtUtc = "2027-04-18T09:30:00+02:00";
    expect(() => validateSyntheticDataset(offsetTimestamp)).toThrow(/UTC/i);

    const naiveTimestamp = cloneDataset();
    getAtOrThrow(naiveTimestamp.events, 0, "event").startsAtUtc = "2027-04-18T09:30:00";
    expect(() => validateSyntheticDataset(naiveTimestamp)).toThrow(/UTC/i);

    const invalidDate = cloneDataset();
    getAtOrThrow(invalidDate.events, 0, "event").startsAtUtc = "2027-02-30T09:30:00Z";
    expect(() => validateSyntheticDataset(invalidDate)).toThrow(/UTC/i);

    const wrongTimezone = cloneDataset();
    (getAtOrThrow(wrongTimezone.events, 0, "event") as { timezone: string }).timezone =
      "Europe/London";
    expect(() => validateSyntheticDataset(wrongTimezone)).toThrow();
  });

  it("rejects emails outside RFC 2606 .invalid domains", () => {
    const nonReservedEmail = ["corredor", ["ejemplo", "com"].join(".")].join("@");

    const badAccountEmail = cloneDataset();
    getAtOrThrow(badAccountEmail.demoAccounts, 0, "demoAccount").email = nonReservedEmail;
    expect(() => validateSyntheticDataset(badAccountEmail)).toThrow(/\.invalid/i);

    const badOrgEmail = cloneDataset();
    getAtOrThrow(badOrgEmail.organizations, 0, "organization").publicContactEmail =
      nonReservedEmail;
    expect(() => validateSyntheticDataset(badOrgEmail)).toThrow(/\.invalid/i);

    const badInviteEmail = cloneDataset();
    const invitedMembership = badInviteEmail.memberships.find((m) => m.status === "INVITED");
    if (!invitedMembership) {
      throw new Error("Expected INVITED membership fixture");
    }
    invitedMembership.invitedEmail = nonReservedEmail;
    expect(() => validateSyntheticDataset(badInviteEmail)).toThrow(/\.invalid/i);
  });

  it("rejects banned illustrative mock data from the presentation decks", () => {
    const withDavidCano = cloneDataset();
    getAtOrThrow(withDavidCano.demoAccounts, 0, "demoAccount").displayName = "David Cano";
    expect(() => assertNoBannedMockData(withDavidCano)).toThrow(/david cano/i);
    expect(() => validateSyntheticDataset(withDavidCano)).toThrow(/david cano/i);

    const withRobledal = cloneDataset();
    getAtOrThrow(withRobledal.events, 0, "event").title = "Trail del Robledal";
    expect(() => assertNoBannedMockData(withRobledal)).toThrow(/trail del robledal/i);
    expect(() => validateSyntheticDataset(withRobledal)).toThrow(/trail del robledal/i);

    const withAccented10k = cloneDataset();
    getAtOrThrow(withAccented10k.events, 6, "event").title = "10K Madrid Río";
    expect(() => assertNoBannedMockData(withAccented10k)).toThrow(/10k madrid rio/i);

    const withOakRunAndLevels = cloneDataset();
    getAtOrThrow(withOakRunAndLevels.events, 1, "event").regulationSummary =
      "Consulta oak.run para nivel Explorer y Pathfinder";
    expect(() => assertNoBannedMockData(withOakRunAndLevels)).toThrow(/oak\.run/i);
  });

  it("rejects duplicate IDs and duplicate slugs across entities", () => {
    const duplicateEventSlug = cloneDataset();
    const ev0 = getAtOrThrow(duplicateEventSlug.events, 0, "event0");
    const ev1 = getAtOrThrow(duplicateEventSlug.events, 1, "event1");
    ev1.slug = ev0.slug;
    expect(() => validateSyntheticDataset(duplicateEventSlug)).toThrow(/Duplicate event\.slug/);

    const duplicateEventId = cloneDataset();
    getAtOrThrow(duplicateEventId.events, 1, "event1").id = getAtOrThrow(
      duplicateEventId.events,
      0,
      "event0",
    ).id;
    expect(() => validateSyntheticDataset(duplicateEventId)).toThrow(/Duplicate event\.id/);

    const duplicateOrgSlug = cloneDataset();
    getAtOrThrow(duplicateOrgSlug.organizations, 1, "org1").slug = getAtOrThrow(
      duplicateOrgSlug.organizations,
      0,
      "org0",
    ).slug;
    expect(() => validateSyntheticDataset(duplicateOrgSlug)).toThrow(
      /Duplicate organization\.slug/,
    );

    const duplicateModalityId = cloneDataset();
    getAtOrThrow(getAtOrThrow(duplicateModalityId.events, 1, "event1").modalities, 0, "mod1").id =
      getAtOrThrow(getAtOrThrow(duplicateModalityId.events, 0, "event0").modalities, 0, "mod0").id;
    expect(() => validateSyntheticDataset(duplicateModalityId)).toThrow(/Duplicate modality\.id/);
  });

  it("rejects invalid event/organization counts, non-trail/running disciplines and non-Madrid events", () => {
    const elevenEvents = cloneDataset();
    elevenEvents.events = elevenEvents.events.slice(0, 11);
    expect(() => validateSyntheticDataset(elevenEvents)).toThrow();

    const oneOrg = cloneDataset();
    oneOrg.organizations = oneOrg.organizations.slice(0, 1);
    expect(() => validateSyntheticDataset(oneOrg)).toThrow();

    const cyclingDiscipline = cloneDataset();
    (getAtOrThrow(cyclingDiscipline.events, 0, "event") as { discipline: string }).discipline =
      "ciclismo";
    expect(() => validateSyntheticDataset(cyclingDiscipline)).toThrow();

    const outsideMadridRegion = cloneDataset();
    (getAtOrThrow(outsideMadridRegion.events, 0, "event") as { region: string }).region =
      "Castilla y León";
    expect(() => validateSyntheticDataset(outsideMadridRegion)).toThrow();

    const outsideMadridMunicipality = cloneDataset();
    getAtOrThrow(outsideMadridMunicipality.events, 0, "event").municipality = "Segovia";
    expect(() => validateSyntheticDataset(outsideMadridMunicipality)).toThrow(/Madrid/);
  });

  it("rejects datasets missing required edge cases or breaking capacity and payment invariants", () => {
    const noSoldOut = cloneDataset();
    const soldOutMod = getAtOrThrow(
      getAtOrThrow(noSoldOut.events, 2, "soldOutEvent").modalities,
      0,
      "soldOutMod",
    );
    soldOutMod.reservedCount = 140;
    soldOutMod.remainingSpots = 10;
    expect(() => validateSyntheticDataset(noSoldOut)).toThrow(/remainingSpots=0/);

    const noLastSpot = cloneDataset();
    const lastSpotMod = getAtOrThrow(
      getAtOrThrow(noLastSpot.events, 1, "lastSpotEvent").modalities,
      0,
      "lastSpotMod",
    );
    lastSpotMod.reservedCount = 90;
    lastSpotMod.remainingSpots = 10;
    expect(() => validateSyntheticDataset(noLastSpot)).toThrow(/remainingSpots=1/);

    const noFreeTier = cloneDataset();
    const freeTier = getAtOrThrow(
      getAtOrThrow(getAtOrThrow(noFreeTier.events, 7, "freeEvent").modalities, 0, "freeMod")
        .priceTiers,
      0,
      "freeTier",
    );
    freeTier.amountCents = 500;
    freeTier.totalCents = 500;
    expect(() => validateSyntheticDataset(noFreeTier)).toThrow(/0 EUR/);

    const oversoldModality = cloneDataset();
    const modToOversell = getAtOrThrow(
      getAtOrThrow(oversoldModality.events, 0, "event").modalities,
      0,
      "mod",
    );
    modToOversell.reservedCount = modToOversell.capacityLimit + 1;
    expect(() => validateSyntheticDataset(oversoldModality)).toThrow(/exceeds capacityLimit/);

    const mismatchedSpots = cloneDataset();
    getAtOrThrow(
      getAtOrThrow(mismatchedSpots.events, 0, "event").modalities,
      0,
      "mod",
    ).remainingSpots = 999;
    expect(() => validateSyntheticDataset(mismatchedSpots)).toThrow(
      /capacityLimit - reservedCount/,
    );

    const missingInvitedMembership = cloneDataset();
    missingInvitedMembership.memberships = missingInvitedMembership.memberships.filter(
      (m) => m.status !== "INVITED",
    );
    expect(() => validateSyntheticDataset(missingInvitedMembership)).toThrow(/INVITED/);

    const newAthleteWithReg = cloneDataset();
    const newAthlete = newAthleteWithReg.demoAccounts.find((a) => a.kind === "athlete-new");
    if (!newAthlete) {
      throw new Error("Expected athlete-new account");
    }
    getAtOrThrow(newAthleteWithReg.registrations, 0, "reg0").userId = newAthlete.id;
    expect(() => validateSyntheticDataset(newAthleteWithReg)).toThrow(/zero registrations/i);

    const paidWithoutSucceeded = cloneDataset();
    const firstPayment = getAtOrThrow(paidWithoutSucceeded.payments, 0, "payment0");
    firstPayment.status = "FAILED";
    expect(() => validateSyntheticDataset(paidWithoutSucceeded)).toThrow(/SUCCEEDED/);
  });

  it("rejects non-object roots, invalid calendar dates, circular objects and banned terms in keys", () => {
    expect(() => validateSyntheticDataset("invalid-root")).toThrow(/\$/);
    expect(() => assertNoBannedMockData(42)).not.toThrow();
    expect(() => assertNoBannedMockData(null)).not.toThrow();

    const circular: Record<string, unknown> = { ok: "safe" };
    circular.self = circular;
    expect(() => assertNoBannedMockData(circular)).not.toThrow();

    const bannedInKey = Object.fromEntries([["David Cano", "synthetic"]]);
    expect(() => assertNoBannedMockData(bannedInKey)).toThrow(/detected in key/i);

    const invalidCalendarMonth = cloneDataset();
    getAtOrThrow(invalidCalendarMonth.events, 0, "event").startsAtUtc = "2027-13-01T00:00:00Z";
    expect(() => validateSyntheticDataset(invalidCalendarMonth)).toThrow(/UTC/i);
  });

  it("enforces fail-closed validation inside buildValidationReport even for pre-cast mutated inputs", () => {
    const mutatedDirect = cloneDataset();
    getAtOrThrow(
      getAtOrThrow(getAtOrThrow(mutatedDirect.events, 0, "event").modalities, 0, "mod").priceTiers,
      0,
      "tier",
    ).amountCents = 19.99;

    expect(() => buildValidationReport(mutatedDirect)).toThrow();
    expect(() => buildValidationReport({ invalid: true })).toThrow();
  });

  it("enforces role, MFA and uniqueness invariants for demo accounts and organizations", () => {
    const historyAsAdmin = cloneDataset();
    const historyAcc = historyAsAdmin.demoAccounts.find((a) => a.kind === "athlete-history");
    if (!historyAcc) {
      throw new Error("Expected athlete-history");
    }
    historyAcc.platformRole = "ADMIN";
    expect(() => validateSyntheticDataset(historyAsAdmin)).toThrow(/platformRole ATHLETE/);

    const newAsAdmin = cloneDataset();
    const newAcc = newAsAdmin.demoAccounts.find((a) => a.kind === "athlete-new");
    if (!newAcc) {
      throw new Error("Expected athlete-new");
    }
    newAcc.platformRole = "ADMIN";
    expect(() => validateSyntheticDataset(newAsAdmin)).toThrow(/platformRole ATHLETE/);

    const adminWithoutMfa = cloneDataset();
    const adminAcc = adminWithoutMfa.demoAccounts.find((a) => a.kind === "admin");
    if (!adminAcc) {
      throw new Error("Expected admin");
    }
    adminAcc.mfaRequired = false;
    expect(() => validateSyntheticDataset(adminWithoutMfa)).toThrow(/mfaRequired=true/);

    const adminWrongRole = cloneDataset();
    const adminRoleAcc = adminWrongRole.demoAccounts.find((a) => a.kind === "admin");
    if (!adminRoleAcc) {
      throw new Error("Expected admin");
    }
    adminRoleAcc.platformRole = "ATHLETE";
    expect(() => validateSyntheticDataset(adminWrongRole)).toThrow(/mfaRequired=true/);

    const missingAdmin = cloneDataset();
    missingAdmin.demoAccounts = missingAdmin.demoAccounts.filter((a) => a.kind !== "admin");
    expect(() => validateSyntheticDataset(missingAdmin)).toThrow(/athlete-history, athlete-new/);

    const duplicateOrgId = cloneDataset();
    getAtOrThrow(duplicateOrgId.organizations, 1, "org1").id = getAtOrThrow(
      duplicateOrgId.organizations,
      0,
      "org0",
    ).id;
    expect(() => validateSyntheticDataset(duplicateOrgId)).toThrow(/Duplicate organization\.id/);

    const duplicateAccountId = cloneDataset();
    getAtOrThrow(duplicateAccountId.demoAccounts, 1, "acc1").id = getAtOrThrow(
      duplicateAccountId.demoAccounts,
      0,
      "acc0",
    ).id;
    expect(() => validateSyntheticDataset(duplicateAccountId)).toThrow(/Duplicate demoAccount\.id/);

    const duplicateAccountKey = cloneDataset();
    getAtOrThrow(duplicateAccountKey.demoAccounts, 1, "acc1").accountKey = getAtOrThrow(
      duplicateAccountKey.demoAccounts,
      0,
      "acc0",
    ).accountKey;
    expect(() => validateSyntheticDataset(duplicateAccountKey)).toThrow(
      /Duplicate demoAccount\.accountKey/,
    );

    const duplicateAccountEmail = cloneDataset();
    getAtOrThrow(duplicateAccountEmail.demoAccounts, 1, "acc1").email = getAtOrThrow(
      duplicateAccountEmail.demoAccounts,
      0,
      "acc0",
    ).email;
    expect(() => validateSyntheticDataset(duplicateAccountEmail)).toThrow(
      /Duplicate demoAccount\.email/,
    );
  });

  it("enforces multi-tenant organization membership invariants", () => {
    const duplicateMembershipId = cloneDataset();
    getAtOrThrow(duplicateMembershipId.memberships, 1, "m1").id = getAtOrThrow(
      duplicateMembershipId.memberships,
      0,
      "m0",
    ).id;
    expect(() => validateSyntheticDataset(duplicateMembershipId)).toThrow(
      /Duplicate membership\.id/,
    );

    const unknownOrgMembership = cloneDataset();
    getAtOrThrow(unknownOrgMembership.memberships, 0, "m0").organizationId =
      "10000000-0000-4000-8000-000000000999";
    expect(() => validateSyntheticDataset(unknownOrgMembership)).toThrow(/unknown organization/);

    const invitedWithUserId = cloneDataset();
    const invited = invitedWithUserId.memberships.find((m) => m.status === "INVITED");
    if (!invited) {
      throw new Error("Expected INVITED membership");
    }
    invited.userId = getAtOrThrow(invitedWithUserId.demoAccounts, 0, "acc0").id;
    expect(() => validateSyntheticDataset(invitedWithUserId)).toThrow(/INVITED membership/);

    const invitedWithoutEmail = cloneDataset();
    const invitedNoEmail = invitedWithoutEmail.memberships.find((m) => m.status === "INVITED");
    if (!invitedNoEmail) {
      throw new Error("Expected INVITED membership");
    }
    invitedNoEmail.invitedEmail = null;
    expect(() => validateSyntheticDataset(invitedWithoutEmail)).toThrow(/INVITED membership/);

    const activeWithoutUser = cloneDataset();
    const active = activeWithoutUser.memberships.find((m) => m.status === "ACTIVE");
    if (!active) {
      throw new Error("Expected ACTIVE membership");
    }
    active.userId = null;
    expect(() => validateSyntheticDataset(activeWithoutUser)).toThrow(/valid demoAccount userId/);

    const activeWithResidualInvite = cloneDataset();
    const activeResidual = activeWithResidualInvite.memberships.find((m) => m.status === "ACTIVE");
    if (!activeResidual) {
      throw new Error("Expected ACTIVE membership");
    }
    activeResidual.invitedEmail = "residual@oak-demo.invalid";
    expect(() => validateSyntheticDataset(activeWithResidualInvite)).toThrow(
      /must clear invitedEmail/,
    );

    const missingRevoked = cloneDataset();
    missingRevoked.memberships = missingRevoked.memberships.filter((m) => m.status !== "REVOKED");
    expect(() => validateSyntheticDataset(missingRevoked)).toThrow(/REVOKED/);

    const orgWithoutActive = cloneDataset();
    const org2Id = getAtOrThrow(orgWithoutActive.organizations, 1, "org2").id;
    for (const membership of orgWithoutActive.memberships) {
      if (membership.organizationId === org2Id) {
        membership.status = "REVOKED";
        membership.revokedAtUtc = "2026-11-12T10:00:00Z";
      }
    }
    expect(() => validateSyntheticDataset(orgWithoutActive)).toThrow(/at least one ACTIVE/);
  });

  it("enforces event time windows, tier pricing rules and catalog coverage invariants", () => {
    const unknownEventOrg = cloneDataset();
    getAtOrThrow(unknownEventOrg.events, 0, "event0").organizationId =
      "10000000-0000-4000-8000-000000000999";
    expect(() => validateSyntheticDataset(unknownEventOrg)).toThrow(/unknown organizationId/);

    const closesAfterStart = cloneDataset();
    const ev0 = getAtOrThrow(closesAfterStart.events, 0, "event0");
    ev0.registrationClosesAtUtc = "2027-05-01T00:00:00Z";
    expect(() => validateSyntheticDataset(closesAfterStart)).toThrow(
      /registrationClosesAtUtc cannot exceed startsAtUtc/,
    );

    const duplicateTierId = cloneDataset();
    const tier0 = getAtOrThrow(
      getAtOrThrow(getAtOrThrow(duplicateTierId.events, 0, "e0").modalities, 0, "m0").priceTiers,
      0,
      "t0",
    );
    const tier1 = getAtOrThrow(
      getAtOrThrow(getAtOrThrow(duplicateTierId.events, 1, "e1").modalities, 0, "m1").priceTiers,
      0,
      "t1",
    );
    tier1.id = tier0.id;
    expect(() => validateSyntheticDataset(duplicateTierId)).toThrow(/Duplicate priceTier\.id/);

    const tierInvalidWindow = cloneDataset();
    const windowTier = getAtOrThrow(
      getAtOrThrow(getAtOrThrow(tierInvalidWindow.events, 0, "e0").modalities, 0, "m0").priceTiers,
      0,
      "t0",
    );
    windowTier.validFromUtc = "2028-01-01T00:00:00Z";
    expect(() => validateSyntheticDataset(tierInvalidWindow)).toThrow(/validFromUtc cannot exceed/);

    const tierExceedsCapacity = cloneDataset();
    const capMod = getAtOrThrow(
      getAtOrThrow(tierExceedsCapacity.events, 0, "e0").modalities,
      0,
      "m0",
    );
    getAtOrThrow(capMod.priceTiers, 0, "t0").maxQuantity = capMod.capacityLimit + 1;
    expect(() => validateSyntheticDataset(tierExceedsCapacity)).toThrow(
      /maxQuantity cannot exceed/,
    );

    const tierTotalMismatch = cloneDataset();
    getAtOrThrow(
      getAtOrThrow(getAtOrThrow(tierTotalMismatch.events, 0, "e0").modalities, 0, "m0").priceTiers,
      0,
      "t0",
    ).totalCents = 9999;
    expect(() => validateSyntheticDataset(tierTotalMismatch)).toThrow(
      /totalCents must equal amountCents \+ managementFeeCents/,
    );

    const missingRunningDiscipline = cloneDataset();
    for (const event of missingRunningDiscipline.events) {
      event.discipline = "trail";
    }
    expect(() => validateSyntheticDataset(missingRunningDiscipline)).toThrow(/discipline: running/);

    const missingCancelledStatus = cloneDataset();
    for (const event of missingCancelledStatus.events) {
      if (event.status === "CANCELLED") {
        event.status = "CLOSED";
      }
    }
    expect(() => validateSyntheticDataset(missingCancelledStatus)).toThrow(
      /missing required event status: CANCELLED/,
    );

    const orgWithoutEvents = cloneDataset();
    const firstOrgId = getAtOrThrow(orgWithoutEvents.organizations, 0, "org0").id;
    for (const event of orgWithoutEvents.events) {
      event.organizationId = firstOrgId;
    }
    expect(() => validateSyntheticDataset(orgWithoutEvents)).toThrow(/must own at least one event/);

    const noNormalCapacity = cloneDataset();
    for (const event of noNormalCapacity.events) {
      if (event.status === "PUBLISHED") {
        for (const modality of event.modalities) {
          if (modality.remainingSpots >= 10) {
            modality.reservedCount = modality.capacityLimit - 1;
            modality.remainingSpots = 1;
          }
        }
      }
    }
    expect(() => validateSyntheticDataset(noNormalCapacity)).toThrow(/remainingSpots>=10/);

    const noMultiTier = cloneDataset();
    for (const event of noMultiTier.events) {
      for (const modality of event.modalities) {
        modality.priceTiers = modality.priceTiers.slice(0, 1);
      }
    }
    expect(() => validateSyntheticDataset(noMultiTier)).toThrow(/multiple price tiers/);

    const lowSpotsPublishedStillValid = cloneDataset();
    const firstPublishedMod = getAtOrThrow(
      getAtOrThrow(lowSpotsPublishedStillValid.events, 0, "e0").modalities,
      0,
      "m0",
    );
    firstPublishedMod.reservedCount = firstPublishedMod.capacityLimit - 5;
    firstPublishedMod.remainingSpots = 5;
    expect(() => validateSyntheticDataset(lowSpotsPublishedStillValid)).not.toThrow();
  });

  it("enforces favourite, registration, payment and refund reconciliation invariants", () => {
    const favUnknownUser = cloneDataset();
    getAtOrThrow(favUnknownUser.favourites, 0, "fav0").userId =
      "20000000-0000-4000-8000-000000000999";
    expect(() => validateSyntheticDataset(favUnknownUser)).toThrow(/unknown userId or eventId/);

    const newAthleteWithFav = cloneDataset();
    const newAthlete = newAthleteWithFav.demoAccounts.find((a) => a.kind === "athlete-new");
    if (!newAthlete) {
      throw new Error("Expected athlete-new");
    }
    getAtOrThrow(newAthleteWithFav.favourites, 0, "fav0").userId = newAthlete.id;
    expect(() => validateSyntheticDataset(newAthleteWithFav)).toThrow(/pre-existing favourites/);

    const duplicateFav = cloneDataset();
    getAtOrThrow(duplicateFav.favourites, 1, "fav1").eventId = getAtOrThrow(
      duplicateFav.favourites,
      0,
      "fav0",
    ).eventId;
    expect(() => validateSyntheticDataset(duplicateFav)).toThrow(/Duplicate favourite/);

    const duplicateRegId = cloneDataset();
    getAtOrThrow(duplicateRegId.registrations, 1, "reg1").id = getAtOrThrow(
      duplicateRegId.registrations,
      0,
      "reg0",
    ).id;
    expect(() => validateSyntheticDataset(duplicateRegId)).toThrow(/Duplicate registration\.id/);

    const duplicateRegCode = cloneDataset();
    getAtOrThrow(duplicateRegCode.registrations, 1, "reg1").registrationCode = getAtOrThrow(
      duplicateRegCode.registrations,
      0,
      "reg0",
    ).registrationCode;
    expect(() => validateSyntheticDataset(duplicateRegCode)).toThrow(
      /Duplicate registration\.registrationCode/,
    );

    const regForAdmin = cloneDataset();
    const adminAcc = regForAdmin.demoAccounts.find((a) => a.kind === "admin");
    if (!adminAcc) {
      throw new Error("Expected admin");
    }
    getAtOrThrow(regForAdmin.registrations, 0, "reg0").userId = adminAcc.id;
    expect(() => validateSyntheticDataset(regForAdmin)).toThrow(/ATHLETE demo account/);

    const regMissingEvent = cloneDataset();
    getAtOrThrow(regMissingEvent.registrations, 0, "reg0").eventId =
      "40000000-0000-4000-8000-000000000999";
    expect(() => validateSyntheticDataset(regMissingEvent)).toThrow(
      /missing event, modality or priceTier/,
    );

    const regHierarchyMismatch = cloneDataset();
    getAtOrThrow(regHierarchyMismatch.registrations, 0, "reg0").eventId = getAtOrThrow(
      regHierarchyMismatch.events,
      0,
      "e0",
    ).id;
    expect(() => validateSyntheticDataset(regHierarchyMismatch)).toThrow(/inconsistent event/);

    const regAmountMismatch = cloneDataset();
    getAtOrThrow(regAmountMismatch.registrations, 0, "reg0").totalCents = 9999;
    expect(() => validateSyntheticDataset(regAmountMismatch)).toThrow(/authoritative PriceTier/);

    const duplicateActiveReg = cloneDataset();
    const reg0 = getAtOrThrow(duplicateActiveReg.registrations, 0, "reg0");
    const reg2 = getAtOrThrow(duplicateActiveReg.registrations, 2, "reg2");
    reg2.eventId = reg0.eventId;
    reg2.eventModalityId = reg0.eventModalityId;
    reg2.priceTierId = reg0.priceTierId;
    reg2.unitAmountCents = reg0.unitAmountCents;
    reg2.feeCents = reg0.feeCents;
    reg2.totalCents = reg0.totalCents;
    expect(() => validateSyntheticDataset(duplicateActiveReg)).toThrow(
      /Duplicate active registration/,
    );

    const confirmedWithoutTimestamp = cloneDataset();
    getAtOrThrow(confirmedWithoutTimestamp.registrations, 0, "reg0").confirmedAtUtc = null;
    expect(() => validateSyntheticDataset(confirmedWithoutTimestamp)).toThrow(/confirmedAtUtc/);

    const historyWithoutCompleted = cloneDataset();
    const firstReg = getAtOrThrow(historyWithoutCompleted.registrations, 0, "reg0");
    const secondReg = getAtOrThrow(historyWithoutCompleted.registrations, 1, "reg1");
    firstReg.status = "CANCELLED";
    secondReg.status = "CANCELLED";
    expect(() => validateSyntheticDataset(historyWithoutCompleted)).toThrow(/COMPLETED event/);

    const missingDraftReg = cloneDataset();
    missingDraftReg.registrations = missingDraftReg.registrations.filter(
      (r) => r.status !== "DRAFT",
    );
    expect(() => validateSyntheticDataset(missingDraftReg)).toThrow(
      /missing required registration status: DRAFT/,
    );

    const duplicatePaymentId = cloneDataset();
    getAtOrThrow(duplicatePaymentId.payments, 1, "p1").id = getAtOrThrow(
      duplicatePaymentId.payments,
      0,
      "p0",
    ).id;
    expect(() => validateSyntheticDataset(duplicatePaymentId)).toThrow(/Duplicate payment\.id/);

    const duplicateIdempotencyKey = cloneDataset();
    getAtOrThrow(duplicateIdempotencyKey.payments, 1, "p1").idempotencyKey = getAtOrThrow(
      duplicateIdempotencyKey.payments,
      0,
      "p0",
    ).idempotencyKey;
    expect(() => validateSyntheticDataset(duplicateIdempotencyKey)).toThrow(
      /Duplicate payment\.idempotencyKey/,
    );

    const duplicatePaymentForReg = cloneDataset();
    const p0 = getAtOrThrow(duplicatePaymentForReg.payments, 0, "p0");
    const p1 = getAtOrThrow(duplicatePaymentForReg.payments, 1, "p1");
    p1.registrationId = p0.registrationId;
    expect(() => validateSyntheticDataset(duplicatePaymentForReg)).toThrow(
      /Duplicate payment for registration/,
    );

    const paymentUnknownReg = cloneDataset();
    getAtOrThrow(paymentUnknownReg.payments, 0, "p0").registrationId =
      "70000000-0000-4000-8000-000000000999";
    expect(() => validateSyntheticDataset(paymentUnknownReg)).toThrow(/unknown registrationId/);

    const paymentAmountMismatch = cloneDataset();
    getAtOrThrow(paymentAmountMismatch.payments, 0, "p0").amountCents = 1234;
    expect(() => validateSyntheticDataset(paymentAmountMismatch)).toThrow(/does not reconcile/);

    const missingCreatedPayment = cloneDataset();
    missingCreatedPayment.payments = missingCreatedPayment.payments.filter(
      (p) => p.status !== "CREATED",
    );
    expect(() => validateSyntheticDataset(missingCreatedPayment)).toThrow(
      /missing required payment status: CREATED/,
    );

    const refundedWithoutPayment = cloneDataset();
    const closedEvent = getAtOrThrow(refundedWithoutPayment.events, 10, "closedEvent");
    const closedMod = getAtOrThrow(closedEvent.modalities, 0, "closedMod");
    const closedTier = getAtOrThrow(closedMod.priceTiers, 0, "closedTier");
    const baseReg = getAtOrThrow(refundedWithoutPayment.registrations, 0, "reg0");
    refundedWithoutPayment.registrations.push({
      ...structuredClone(baseReg),
      id: "70000000-0000-4000-8000-000000000099",
      registrationCode: "OAK-DEMO-2027-0099",
      eventId: closedEvent.id,
      eventModalityId: closedMod.id,
      priceTierId: closedTier.id,
      unitAmountCents: closedTier.amountCents,
      feeCents: closedTier.managementFeeCents,
      totalCents: closedTier.totalCents,
      status: "REFUNDED",
    });
    expect(() => validateSyntheticDataset(refundedWithoutPayment)).toThrow(/REFUNDED payment/);

    const refundedWithWrongPaymentStatus = cloneDataset();
    const refundedReg = refundedWithWrongPaymentStatus.registrations.find(
      (r) => r.status === "REFUNDED",
    );
    if (!refundedReg) {
      throw new Error("Expected REFUNDED registration");
    }
    const refundedPayment = refundedWithWrongPaymentStatus.payments.find(
      (p) => p.registrationId === refundedReg.id,
    );
    if (!refundedPayment) {
      throw new Error("Expected REFUNDED payment");
    }
    refundedPayment.status = "SUCCEEDED";
    const draftReg = refundedWithWrongPaymentStatus.registrations.find((r) => r.status === "DRAFT");
    if (!draftReg) {
      throw new Error("Expected DRAFT registration");
    }
    const basePay = getAtOrThrow(refundedWithWrongPaymentStatus.payments, 0, "p0");
    refundedWithWrongPaymentStatus.payments.push({
      ...structuredClone(basePay),
      id: "80000000-0000-4000-8000-000000000099",
      registrationId: draftReg.id,
      idempotencyKey: `reg:${draftReg.id}:attempt:1`,
      amountCents: draftReg.totalCents,
      status: "REFUNDED",
    });
    expect(() => validateSyntheticDataset(refundedWithWrongPaymentStatus)).toThrow(
      /REFUNDED payment/,
    );
  });
});
