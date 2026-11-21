import { describe, expect, it } from "vitest";
import canonicalTokens from "../../docs/brand/tokens.oak.v1.json";

interface RgbChannels {
  r: number;
  g: number;
  b: number;
}

/**
 * Parses a 6-digit hexadecimal sRGB color string into integer 8-bit channels.
 */
function parseHexColor(hex: string): RgbChannels {
  const match = /^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/.exec(hex.trim());
  if (!match) {
    throw new Error(`Invalid 6-digit hex color: ${hex}`);
  }
  const [, rHex, gHex, bHex] = match;
  if (rHex === undefined || gHex === undefined || bHex === undefined) {
    throw new Error(`Missing RGB channel in hex color: ${hex}`);
  }
  return {
    r: Number.parseInt(rHex, 16),
    g: Number.parseInt(gHex, 16),
    b: Number.parseInt(bHex, 16),
  };
}

/**
 * Converts an 8-bit sRGB channel (0..255) to linear light per WCAG 2.2.
 */
function linearizeSrgbChannel(channel8Bit: number): number {
  const normalized = channel8Bit / 255;
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

/**
 * Computes WCAG 2.2 relative luminance for a 6-digit hex color.
 */
function relativeLuminance(hex: string): number {
  const { r, g, b } = parseHexColor(hex);
  return (
    0.2126 * linearizeSrgbChannel(r) +
    0.7152 * linearizeSrgbChannel(g) +
    0.0722 * linearizeSrgbChannel(b)
  );
}

/**
 * Computes exact unrounded WCAG 2.2 contrast ratio between two hex colors.
 */
function contrastRatio(fgHex: string, bgHex: string): number {
  const l1 = relativeLuminance(fgHex);
  const l2 = relativeLuminance(bgHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function roundToDecimals(value: number, decimals: number): number {
  return Number(value.toFixed(decimals));
}

/**
 * Asserts strict unrounded >= 4.5:1 functional text contrast.
 */
function assertFunctionalTextContrast(fgHex: string, bgHex: string, label: string): number {
  const exact = contrastRatio(fgHex, bgHex);
  if (exact < 4.5) {
    throw new Error(
      `Contrast below 4.5:1 exact for ${label}: ${fgHex} on ${bgHex} = ${exact.toFixed(4)}:1`,
    );
  }
  return exact;
}

/**
 * Asserts strict unrounded >= 3.0:1 non-text UI border / focus contrast (WCAG 2.2 SC 1.4.11).
 */
function assertUiComponentContrast(fgHex: string, bgHex: string, label: string): number {
  const exact = contrastRatio(fgHex, bgHex);
  if (exact < 3.0) {
    throw new Error(
      `UI contrast below 3.0:1 exact for ${label}: ${fgHex} on ${bgHex} = ${exact.toFixed(4)}:1`,
    );
  }
  return exact;
}

/**
 * Validates typography token compliance against OAK contract (>= 12 px, no weight 650).
 */
function assertTypographyCompliance(entry: {
  minSizePx: number;
  weight: number;
  allowedWeights: readonly number[];
  family: string;
}): void {
  if (entry.minSizePx < 12) {
    throw new Error(`Font size below 12 px minimum: ${String(entry.minSizePx)} px`);
  }
  if (entry.weight === 650 || entry.allowedWeights.includes(650)) {
    throw new Error("Synthesized font weight 650 is prohibited");
  }
  const allowed = new Set([400, 500, 600, 700, 800]);
  if (!allowed.has(entry.weight) || entry.allowedWeights.some((w) => !allowed.has(w))) {
    throw new Error(`Unsupported font weight detected in ${entry.family}`);
  }
}

/**
 * Composites rgba(r, g, b, alpha) over an opaque hex background using 8-bit channel rounding.
 */
function compositeRgba8BitOnHex(rgba: string, bgHex: string): string {
  const match =
    /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0?\.\d+|1|0)\s*\)$/.exec(
      rgba.trim(),
    );
  if (!match) {
    throw new Error(`Invalid rgba string: ${rgba}`);
  }
  const [, rStr, gStr, bStr, aStr] = match;
  if (rStr === undefined || gStr === undefined || bStr === undefined || aStr === undefined) {
    throw new Error(`Incomplete rgba components: ${rgba}`);
  }
  const r = Number.parseInt(rStr, 10);
  const g = Number.parseInt(gStr, 10);
  const b = Number.parseInt(bStr, 10);
  const alpha = Number.parseFloat(aStr);
  const bg = parseHexColor(bgHex);
  const outR = Math.round(r * alpha + bg.r * (1 - alpha));
  const outG = Math.round(g * alpha + bg.g * (1 - alpha));
  const outB = Math.round(b * alpha + bg.b * (1 - alpha));
  const toHex = (n: number): string => n.toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(outR)}${toHex(outG)}${toHex(outB)}`;
}

describe("P1-005 canonical brand tokens and WCAG 2.2 AA contrast matrix", () => {
  it("calibrates WCAG 2.2 sRGB luminance against independent anchor vectors and rejects 4.49:1", () => {
    expect(contrastRatio("#FFFFFF", "#000000")).toBe(21);
    expect(roundToDecimals(contrastRatio("#17211B", "#E3D4BB"), 2)).toBe(11.34);
    expect(roundToDecimals(contrastRatio("#FF6B35", "#E3D4BB"), 2)).toBe(1.94);

    // Boundary check without favorable rounding: 4.4907:1 (rounds to 4.49) and 4.4954:1 (rounds to 4.50) both < 4.5 exact
    expect(roundToDecimals(contrastRatio("#4D6259", "#E3D4BB"), 2)).toBe(4.5 - 0.01);
    expect(() => assertFunctionalTextContrast("#4D6259", "#E3D4BB", "boundary-4.49")).toThrow(
      /4\.5:1/,
    );
    expect(() =>
      assertFunctionalTextContrast("#4D6258", "#E3D4BB", "borderline-muted-sand"),
    ).toThrow(/4\.4954/);

    for (const anchor of canonicalTokens.contrastAudit.anchorVectors) {
      const exact = roundToDecimals(contrastRatio(anchor.foregroundHex, anchor.backgroundHex), 4);
      const rounded = roundToDecimals(exact, 2);
      expect(exact).toBe(anchor.expectedExact);
      expect(rounded).toBe(anchor.expectedRounded);
    }
  });

  it("preserves exact §4.2 core primitives and §4.3 base semantic tokens without pure black/white or deck variables", () => {
    expect(canonicalTokens.gateStatus.D1).toBe("PENDING_USER_VALIDATION");
    expect(canonicalTokens.productLanguageDefault).toBe("es-ES");

    const expectedCorePrimitives = new Map<string, string>([
      ["oak.color.forest.950", "#08291F"],
      ["oak.color.forest.700", "#12372A"],
      ["oak.color.ground.900", "#17211B"],
      ["oak.color.lime.400", "#B7F34A"],
      ["oak.color.orange.500", "#FF6B35"],
      ["oak.color.sky.400", "#28B7E9"],
      ["oak.color.sand.300", "#E3D4BB"],
      ["oak.color.cream.100", "#EADCC5"],
      ["oak.color.muted.700", "#4D6258"],
      ["oak.color.line", "rgba(18, 55, 42, 0.18)"],
    ]);

    const coreEntries = Object.entries(canonicalTokens.color.primitive.core);
    expect(coreEntries).toHaveLength(expectedCorePrimitives.size);
    for (const [tokenName, tokenDef] of coreEntries) {
      expect(tokenDef.value).toBe(expectedCorePrimitives.get(tokenName));
    }

    const expectedBaseSemantics = new Map<string, string>([
      ["surface.canvas", "#E3D4BB"],
      ["surface.raised", "#EADCC5"],
      ["surface.brand", "#12372A"],
      ["surface.inverse", "#08291F"],
      ["text.primary", "#17211B"],
      ["text.secondary", "#4D6258"],
      ["text.brand", "#12372A"],
      ["text.inverse", "#EADCC5"],
      ["action.primary.background", "#FF6B35"],
      ["action.primary.foreground", "#17211B"],
      ["action.secondary.foreground", "#12372A"],
      ["progress.background", "#B7F34A"],
      ["progress.foreground", "#12372A"],
      ["info.background", "#28B7E9"],
      ["info.foreground", "#17211B"],
      ["focus.on-light", "#12372A"],
      ["focus.on-dark", "#B7F34A"],
    ]);

    const baseSemanticEntries = Object.entries(canonicalTokens.color.semantic.base);
    expect(baseSemanticEntries).toHaveLength(expectedBaseSemantics.size);
    for (const [tokenName, tokenDef] of baseSemanticEntries) {
      expect(tokenDef.value).toBe(expectedBaseSemantics.get(tokenName));
    }

    // Reject pure white/black and deck variables in OAK brand token definitions
    const serializedBrandTokens = JSON.stringify({
      color: canonicalTokens.color,
      elevation: canonicalTokens.elevation,
    }).toUpperCase();
    expect(serializedBrandTokens).not.toContain("#FFFFFF");
    expect(serializedBrandTokens).not.toContain("#000000");
    expect(serializedBrandTokens).not.toContain("RGB(255, 255, 255)");
    expect(serializedBrandTokens).not.toContain("RGB(0, 0, 0)");
    expect(serializedBrandTokens).not.toContain("RGBA(0, 0, 0");

    const serializedTokenTree = JSON.stringify({
      color: canonicalTokens.color,
      typography: canonicalTokens.typography,
      spacing: canonicalTokens.spacing,
      radius: canonicalTokens.radius,
      elevation: canonicalTokens.elevation,
      responsive: canonicalTokens.responsive,
      accessibility: canonicalTokens.accessibility,
      motion: canonicalTokens.motion,
    });
    for (const forbiddenDeckVar of ["--mist", "--forest-deep", "--deep"]) {
      expect(serializedTokenTree).not.toContain(forbiddenDeckVar);
    }
  });

  it("marks all D1-05 candidate status and viz tokens as pending D1 approval with mandatory text/icon signifiers", () => {
    const candidateEntries = Object.entries(canonicalTokens.color.semantic.d1Candidates);
    expect(candidateEntries.length).toBeGreaterThanOrEqual(36);

    const requiredStatusPrefixes = [
      "status.success.",
      "status.warning.",
      "status.danger.",
      "status.disabled.",
      "viz.",
    ];
    for (const prefix of requiredStatusPrefixes) {
      expect(candidateEntries.some(([name]) => name.startsWith(prefix))).toBe(true);
    }

    const auditedCandidateIds = new Set(
      canonicalTokens.contrastAudit.candidateD1Pairs.map((pair) => pair.foregroundToken),
    );
    const auditedUiBorderIds = new Set(
      canonicalTokens.contrastAudit.uiComponentAndFocusPairs.map((pair) => pair.foregroundToken),
    );
    const surfaceLookup = new Map<string, string>([
      ...Object.entries(canonicalTokens.color.semantic.base).map(
        ([k, v]) => [k, v.value] as [string, string],
      ),
      ...candidateEntries.map(([k, v]) => [k, v.value] as [string, string]),
    ]);

    for (const [tokenName, tokenDef] of candidateEntries) {
      expect(tokenDef.candidateForD1Approval).toBe(true);
      expect(tokenDef.gateStatus).toBe("PENDING_D1_APPROVAL");
      expect(tokenDef.requiresTextAndIcon).toBe(true);
      expect(tokenDef.nonColorSignifier.trim().length).toBeGreaterThan(10);

      if ("assignedSurfaces" in tokenDef && Array.isArray(tokenDef.assignedSurfaces)) {
        for (const surfaceName of tokenDef.assignedSurfaces) {
          const surfaceHex = surfaceLookup.get(surfaceName);
          expect(surfaceHex).toBeDefined();
          if (surfaceHex !== undefined) {
            const exact = assertFunctionalTextContrast(
              tokenDef.value,
              surfaceHex,
              `${tokenName} on ${surfaceName}`,
            );
            expect(exact).toBeGreaterThanOrEqual(4.5);
          }
        }
        if (tokenName.includes(".foreground") || tokenName.startsWith("viz.")) {
          expect(auditedCandidateIds.has(tokenName)).toBe(true);
        }
        if (tokenName.includes(".border.")) {
          expect(auditedUiBorderIds.has(tokenName)).toBe(true);
        }
      }
    }

    const fullSerialized = JSON.stringify(canonicalTokens);
    for (const bannedMockTerm of [
      "David Cano",
      "Trail del Robledal",
      "Pedales de Guadarrama",
      "10K Madrid Rio",
      "Sierra Norte Trail",
      "oak.run",
      "Explorer",
      "Pathfinder",
    ]) {
      expect(fullSerialized).not.toContain(bannedMockTerm);
    }
  });

  it("validates typography, spacing, radius, elevation, responsive breakpoints, touch targets, focus and motion", () => {
    const { typography, spacing, radius, elevation, responsive, accessibility, motion } =
      canonicalTokens;

    expect(typography.families.display.name).toBe("Sora");
    expect(typography.families.interface.name).toBe("Inter");
    expect(typography.deliveryPolicy.strategy).toBe("local-woff2-subsetted");
    expect(typography.deliveryPolicy.externalCdnAllowed).toBe(false);
    expect(typography.deliveryPolicy.forbiddenDomains).toContain("fonts.googleapis.com");
    expect(JSON.stringify(typography.families)).not.toContain("fonts.googleapis.com");
    expect(typography.weights.allowed).toEqual([400, 500, 600, 700, 800]);
    expect(typography.weights.forbidden).toContain(650);

    for (const [_name, scaleEntry] of Object.entries(typography.scale)) {
      assertTypographyCompliance(scaleEntry);
    }

    // Negative typography checks
    expect(() =>
      assertTypographyCompliance({
        minSizePx: 10,
        weight: 400,
        allowedWeights: [400],
        family: "Inter",
      }),
    ).toThrow(/12 px/);
    expect(() =>
      assertTypographyCompliance({
        minSizePx: 14,
        weight: 650,
        allowedWeights: [650],
        family: "Sora",
      }),
    ).toThrow(/650/);

    expect(spacing.baseUnitPx).toBe(4);
    expect(Object.keys(spacing.scale).length).toBeGreaterThanOrEqual(10);
    expect(Object.keys(radius.scale).length).toBeGreaterThanOrEqual(5);
    expect(Object.keys(elevation.scale).length).toBeGreaterThanOrEqual(4);

    expect(responsive.canonicalThresholdsPx).toEqual([320, 768, 1200]);
    expect(responsive.designCanvasPx).toBe(1440);
    expect(responsive.breakpoints.mobile.columns).toBe(4);
    expect(responsive.breakpoints.tablet.columns).toBe(8);
    expect(responsive.breakpoints.desktop.columns).toBe(12);
    expect(responsive.referenceViewports).toEqual([
      "320x568",
      "390x844",
      "768x1024",
      "1200x800",
      "1440x900",
    ]);

    expect(accessibility.focus.ringWidthPx).toBeGreaterThanOrEqual(3);
    expect(accessibility.focus.ringOffsetPx).toBeGreaterThanOrEqual(2);
    expect(accessibility.focus.minContrastRatio).toBeGreaterThanOrEqual(3.0);
    expect(accessibility.touchTarget.minWidthPx).toBeGreaterThanOrEqual(48);
    expect(accessibility.touchTarget.minHeightPx).toBeGreaterThanOrEqual(48);
    expect(accessibility.reflow.minViewportWidthPx).toBe(320);
    expect(accessibility.reflow.maxZoomPercent).toBe(200);

    expect(motion.tokens["motion.fast"].durationMs).toBe(160);
    expect(motion.tokens["motion.standard"].durationMs).toBe(240);
    expect(motion.tokens["motion.reveal"].durationMs).toBe(480);
    expect(motion.tokens["motion.route.max"].durationMs).toBe(1200);
    expect(motion.tokens["motion.ease.out"].value).toBe("cubic-bezier(0.16, 1, 0.3, 1)");
    expect(motion.reducedMotion.mediaQuery).toBe("(prefers-reduced-motion: reduce)");
    expect(motion.reducedMotion.durationOverrideMs).toBe(0);
    expect(motion.reducedMotion.requiresJsMatchMediaCheck).toBe(true);
  });

  it("recomputes and enforces every approved base pair, D1-05 candidate pair, UI border, focus ring and decorative line rule", () => {
    const {
      approvedBasePairs,
      candidateD1Pairs,
      uiComponentAndFocusPairs,
      decorativeNonTextDividers,
    } = canonicalTokens.contrastAudit;

    const borderlineExceptions = approvedBasePairs.filter((pair) => pair.legacyBorderlineException);
    expect(borderlineExceptions).toHaveLength(1);
    const mutedSandPair = borderlineExceptions.at(0);
    expect(mutedSandPair).toBeDefined();
    if (mutedSandPair !== undefined) {
      const liveMutedSand = contrastRatio(mutedSandPair.foregroundHex, mutedSandPair.backgroundHex);
      expect(roundToDecimals(liveMutedSand, 4)).toBe(4.4954);
      expect(roundToDecimals(liveMutedSand, 2)).toBe(4.5);
      expect(mutedSandPair.exactRatio).toBe(4.4954);
      expect(mutedSandPair.roundedRatio).toBe(4.5);
      expect(mutedSandPair.passesExact).toBe(false);
    }

    for (const pair of approvedBasePairs) {
      const liveExact = contrastRatio(pair.foregroundHex, pair.backgroundHex);
      expect(roundToDecimals(liveExact, 4)).toBe(pair.exactRatio);
      expect(roundToDecimals(liveExact, 2)).toBe(pair.roundedRatio);

      if (!pair.legacyBorderlineException) {
        expect(pair.passesExact).toBe(true);
        assertFunctionalTextContrast(pair.foregroundHex, pair.backgroundHex, pair.id);
      }
    }

    // All new D1-05 candidate pairs MUST pass >= 4.5:1 exact without favorable rounding
    expect(candidateD1Pairs.length).toBeGreaterThanOrEqual(40);
    for (const pair of candidateD1Pairs) {
      const liveExact = assertFunctionalTextContrast(
        pair.foregroundHex,
        pair.backgroundHex,
        pair.id,
      );
      expect(pair.candidateForD1Approval).toBe(true);
      expect(pair.passesExact).toBe(true);
      expect(roundToDecimals(liveExact, 4)).toBe(pair.exactRatio);
      expect(roundToDecimals(liveExact, 2)).toBe(pair.roundedRatio);
    }

    // All functional UI control borders and focus rings MUST pass >= 3.0:1 exact (WCAG 2.2 SC 1.4.11)
    expect(uiComponentAndFocusPairs.length).toBeGreaterThanOrEqual(15);
    for (const pair of uiComponentAndFocusPairs) {
      const liveExact = assertUiComponentContrast(pair.foregroundHex, pair.backgroundHex, pair.id);
      expect(pair.passesExact).toBe(true);
      expect(roundToDecimals(liveExact, 4)).toBe(pair.exactRatio);
      expect(roundToDecimals(liveExact, 2)).toBe(pair.roundedRatio);
    }

    // Decorative dividers (oak.color.line) must remain < 3.0:1 and marked forbidden for functional UI borders/focus
    expect(canonicalTokens.color.semantic.borders["border.divider.decorative"].decorativeOnly).toBe(
      true,
    );
    expect(canonicalTokens.color.semantic.borders["border.control.default"].decorativeOnly).toBe(
      false,
    );
    for (const divider of decorativeNonTextDividers) {
      expect(divider.decorativeOnly).toBe(true);
      expect(divider.forbiddenForUiBordersOrFocusOrText).toBe(true);
      const compositedHex = compositeRgba8BitOnHex(divider.rgba, divider.backgroundHex);
      expect(compositedHex).toBe(divider.composited8BitHex);
      const liveExact = contrastRatio(compositedHex, divider.backgroundHex);
      expect(roundToDecimals(liveExact, 4)).toBe(divider.exactRatio8BitComposite);
      expect(liveExact).toBeLessThan(3.0);
      expect(() =>
        assertUiComponentContrast(compositedHex, divider.backgroundHex, divider.id),
      ).toThrow(/3\.0:1/);
    }
  });

  it("explicitly rejects all prohibited contrast pairs including Orange/Cream and Sky/Cream on surface.raised", () => {
    const { approvedBasePairs, candidateD1Pairs, uiComponentAndFocusPairs, prohibitedPairs } =
      canonicalTokens.contrastAudit;

    const requiredProhibitedLabels = [
      "Orange/Sand",
      "Sky/Sand",
      "Cream/Orange",
      "Lime/Sand",
      "Lime/Cream",
      "Orange/Cream",
      "Sky/Cream",
    ];

    const prohibitedLabels = new Set(prohibitedPairs.map((pair) => pair.label));
    for (const label of requiredProhibitedLabels) {
      expect(prohibitedLabels.has(label)).toBe(true);
    }

    const allowedKeys = new Set([
      ...approvedBasePairs.map((p) => `${p.foregroundHex}->${p.backgroundHex}`),
      ...candidateD1Pairs.map((p) => `${p.foregroundHex}->${p.backgroundHex}`),
      ...uiComponentAndFocusPairs.map((p) => `${p.foregroundHex}->${p.backgroundHex}`),
    ]);

    for (const pair of prohibitedPairs) {
      const liveExact = contrastRatio(pair.foregroundHex, pair.backgroundHex);
      expect(roundToDecimals(liveExact, 4)).toBe(pair.exactRatio);
      expect(roundToDecimals(liveExact, 2)).toBe(pair.roundedRatio);
      expect(liveExact).toBeLessThan(3.0);
      expect(() =>
        assertFunctionalTextContrast(pair.foregroundHex, pair.backgroundHex, pair.label),
      ).toThrow(/4\.5:1/);
      expect(() =>
        assertUiComponentContrast(pair.foregroundHex, pair.backgroundHex, pair.label),
      ).toThrow(/3\.0:1/);
      expect(allowedKeys.has(`${pair.foregroundHex}->${pair.backgroundHex}`)).toBe(false);
    }
  });
});
