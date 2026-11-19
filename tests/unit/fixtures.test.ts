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
});
