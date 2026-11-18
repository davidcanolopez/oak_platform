import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";
import security from "eslint-plugin-security";
import sdl from "@microsoft/eslint-plugin-sdl";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "reports/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "sites/**",
      "next-env.d.ts",
    ],
  },
  ...nextVitals,
  ...nextTs,
  ...sdl.configs.common,
  ...sdl.configs.node,
  security.configs.recommended,
  {
    rules: {
      "@microsoft/sdl/no-insecure-url": [
        "error",
        {
          exceptions: [
            "^http://localhost(?::[0-9]+)?(?:/.*)?$",
            "^http://127\\.0\\.0\\.1(?::[0-9]+)?(?:/.*)?$",
            "^http://schemas\\.microsoft\\.com/.*$",
            "^http://schemas\\.openxmlformats\\.org/.*$",
            "^http://www\\.w3\\.org/1999/xhtml$",
            "^http://www\\.w3\\.org/2000/svg$",
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unused-expressions": "error",
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      "react/no-danger": "error",
      "react/iframe-missing-sandbox": "error",
      "react/jsx-no-target-blank": [
        "error",
        {
          allowReferrer: false,
          enforceDynamicLinks: "always",
          warnOnSpreadAttributes: true,
        },
      ],
    },
  },
  {
    files: ["scripts/ci/**/*.mjs", "scripts/security/**/*.{mjs,ts}"],
    rules: {
      // Scripts CLI internos validan rutas dentro de reports/ o procedentes de git ls-files.
      "security/detect-non-literal-fs-filename": "off",
    },
  },
  {
    files: ["src/app/**/*.{ts,tsx}", "src/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "pg",
              message:
                "Direct DB access from presentation layer is forbidden (ADR-003 / SYSTEM_ARCHITECTURE.md).",
            },
            {
              name: "@supabase/supabase-js",
              message:
                "Direct Supabase client access from presentation layer is forbidden (ADR-003).",
            },
            {
              name: "@supabase/ssr",
              message:
                "Direct Supabase SSR client access from presentation layer is forbidden (ADR-003).",
            },
            {
              name: "@electric-sql/pglite",
              message: "Direct PGlite access from presentation layer is forbidden (ADR-001).",
            },
            {
              name: "stripe",
              message:
                "Direct Stripe server SDK access from presentation layer is forbidden (ADR-003).",
            },
            {
              name: "resend",
              message: "Direct Resend SDK access from presentation layer is forbidden (ADR-003).",
            },
            {
              name: "@/shared/infrastructure/db/admin-client",
              message: "Admin DB bypass client is forbidden in presentation layer (ADR-003).",
            },
          ],
          patterns: [
            {
              group: [
                "@/shared/infrastructure/db*",
                "@/shared/infrastructure/db/*",
                "**/infrastructure/**",
                "@/modules/*/infrastructure/*",
              ],
              message:
                "Presentation layer must invoke application contracts, never infrastructure.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/modules/*/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "pg",
              message: "Domain layer must remain pure TypeScript without DB drivers.",
            },
            {
              name: "stripe",
              message: "Domain layer must remain pure TypeScript without provider SDKs.",
            },
            {
              name: "resend",
              message: "Domain layer must remain pure TypeScript without provider SDKs.",
            },
            {
              name: "@/shared/env",
              message: "Domain layer must not depend on process environment configuration.",
            },
          ],
          patterns: [
            {
              group: ["next", "next/*", "@supabase/*", "@/shared/infrastructure/*"],
              message: "Domain layer must not import framework or infrastructure packages.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
