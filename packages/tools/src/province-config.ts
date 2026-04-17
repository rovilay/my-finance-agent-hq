import { SupportedTaxYear } from '@hq/validation-schema';

// ─── Federal data ─────────────────────────────────────────────────────────────
// Single source of truth for Canada-wide tax parameters.

export const FEDERAL_TAX_BRACKETS: Record<SupportedTaxYear, TaxBracket[]> = {
  2025: [
    { threshold: 173205, rate: 0.29 },
    { threshold: 111733, rate: 0.26 },
    { threshold: 55867, rate: 0.205 },
    { threshold: 0, rate: 0.15 },
  ],
  2026: [
    { threshold: 173205, rate: 0.29 },
    { threshold: 111733, rate: 0.26 },
    { threshold: 55867, rate: 0.205 },
    { threshold: 0, rate: 0.15 },
  ],
};

/** Federal Basic Personal Amount — amount and the lowest federal rate used to compute the credit. */
export const FEDERAL_BPA: Record<SupportedTaxYear, { amount: number; rate: number }> = {
  2025: { amount: 16200, rate: 0.15 },
  2026: { amount: 16200, rate: 0.15 },
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TaxBracket {
  threshold: number;
  rate: number;
}

export interface ProvincialBPA {
  amount: number;
  /** Lowest provincial income tax rate — used to calculate the non-refundable credit */
  lowestRate: number;
}

export interface ProvinceConfig {
  /** Two-letter Canada Post code (e.g. 'ON') */
  code: string;
  /** Full province name (e.g. 'Ontario') */
  name: string;
  /** Combined sales tax rate (HST where applicable, otherwise GST + PST effective rate) */
  salesTaxRate: number;
  /** Common name for the sales tax in this province (e.g. 'HST', 'GST + PST') */
  salesTaxName: string;
  /** Progressive provincial income tax brackets per supported tax year */
  provincialBrackets: Record<SupportedTaxYear, TaxBracket[]>;
  /** Provincial Basic Personal Amount (BPA) credit configuration per year */
  basicPersonalAmount: Record<SupportedTaxYear, ProvincialBPA>;
  /**
   * Province-specific non-refundable/refundable credits visible to users.
   * Agents and education pages can render these alongside federal credits.
   */
  provinceSpecificCredits: {
    name: string;
    amount: string;
    who: string;
    description: string;
  }[];
  /**
   * Short blurb used in agent system prompts to contextualise provincial tax.
   * Keep it brief — the agent templates embed this inline.
   */
  agentContext: string;
}

// ─── Ontario ──────────────────────────────────────────────────────────────────

export const ONTARIO_CONFIG: ProvinceConfig = {
  code: 'ON',
  name: 'Ontario',
  salesTaxRate: 0.13,
  salesTaxName: 'HST',
  provincialBrackets: {
    2025: [
      { threshold: 173205, rate: 0.1316 },
      { threshold: 150000, rate: 0.1216 },
      { threshold: 102894, rate: 0.1116 },
      { threshold: 51446, rate: 0.0915 },
      { threshold: 0, rate: 0.0505 },
    ],
    2026: [
      { threshold: 173205, rate: 0.1316 },
      { threshold: 150000, rate: 0.1216 },
      { threshold: 102894, rate: 0.1116 },
      { threshold: 51446, rate: 0.0915 },
      { threshold: 0, rate: 0.0505 },
    ],
  },
  basicPersonalAmount: {
    2025: { amount: 12500, lowestRate: 0.0505 },
    2026: { amount: 12500, lowestRate: 0.0505 },
  },
  provinceSpecificCredits: [
    {
      name: 'Ontario Trillium Benefit',
      amount: 'Varies',
      who: 'Ontario residents',
      description: 'Combines energy, sales, and property tax credits into monthly payments.',
    },
    {
      name: "Ontario Senior Homeowners' Property Tax Grant",
      amount: 'Up to $500',
      who: 'Ontario seniors who own a home',
      description: 'Annual grant to help eligible seniors with property tax costs.',
    },
  ],
  agentContext:
    'Provincial Tax: Ontario tax (pays for local services like hospitals, schools). ' +
    'Ontario BPA: First $12,500 of provincial income is covered by the basic personal amount credit. ' +
    'Ontario Trillium Benefit: Energy and property tax credits paid monthly.',
};

// ─── Registry ─────────────────────────────────────────────────────────────────

/** Provinces with full tax configuration. Add new entries here as they are supported. */
export const SUPPORTED_PROVINCES = ['Ontario'] as const;
export type SupportedProvince = (typeof SUPPORTED_PROVINCES)[number];

/**
 * All supported province configurations, keyed by both full name and code
 * so callers can pass either (e.g. 'Ontario' or 'ON').
 */
export const PROVINCE_CONFIGS: Record<string, ProvinceConfig> = {
  Ontario: ONTARIO_CONFIG,
  ON: ONTARIO_CONFIG,
};

export const DEFAULT_PROVINCE: SupportedProvince = 'Ontario';

/**
 * Look up a province's configuration.
 * Falls back to Ontario if the province is not yet supported.
 */
export const getProvinceConfig = (province: string): ProvinceConfig =>
  PROVINCE_CONFIGS[province] ?? ONTARIO_CONFIG;
