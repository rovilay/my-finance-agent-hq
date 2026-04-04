/**
 * Modular extraction prompts for Gemini tax document processing.
 *
 * Each slip type has its own:
 *   - systemInstruction  — sets the model's role and output contract
 *   - userPrompt         — the per-call instruction sent with the document
 *   - outputSchema       — TypeScript type describing the expected JSON shape
 *
 * Add new slip types here; gemini.service.ts detects the type and picks the right config.
 */

// ─── Shared rules injected into every system instruction ─────────────────────

const SHARED_RULES = `
RULES:
- Return ONLY a valid JSON object. No markdown, no prose, no code fences.
- If a field is not present or cannot be read, use null (never omit the key).
- All monetary values must be numbers (not strings). Do not include currency symbols.
- taxYear must be a 4-digit number (e.g. 2025).
- documentType must be the CRA slip code exactly as shown (e.g. "T4", "T3").
- "sin" is a 9-digit identifier string (e.g. "123456789"). It is NOT a monetary value. Do not format it as a number or currency.
- Other identifier/code fields (accountNumber, employerAccountNumber, beneficiaryCode, etc.) are also strings, not monetary values.
`.trim();

// ─── T4 ───────────────────────────────────────────────────────────────────────

/**
 * T4 — Statement of Remuneration Paid
 * Fields reference the official CRA box numbering.
 */
export const T4_EXTRACTION = {
  systemInstruction: `
You are an expert Canadian tax assistant specialising in CRA slip extraction.
You are reading a T4 — Statement of Remuneration Paid.

Extract the following fields and return them as a single JSON object.

FIELD MAP (key → CRA box):
  documentType          → always "T4"
  taxYear               → Year field (top of slip)
  employerName          → Employer's name
  employerAccountNumber → Box 54 (Employer's account number / BN)
  provinceOfEmployment  → Box 10 (2-letter province code, e.g. "ON")
  sin                   → Box 12 (Social insurance number — 9-digit string, no dashes, NOT a dollar amount)
  employmentCode        → Box 29 (Employment code — numeric)

  // Core income & withholdings
  employmentIncome      → Box 14 (Employment income)
  incomeTaxDeducted     → Box 22 (Income tax deducted)
  cppContributions      → Box 16 (Employee's CPP contributions)
  cpp2Contributions     → Box 16A (Employee's second CPP contributions)
  eiPremiums            → Box 18 (Employee's EI premiums)

  // Pension & savings
  rppContributions      → Box 20 (RPP contributions)
  pensionAdjustment     → Box 52 (Pension adjustment)
  rppOrDrspNumber       → Box 50 (RPP or DPSP registration number)

  // Earnings bases (used to validate CPP/EI calculations)
  cppPensionableEarnings → Box 26 (CPP/QPP pensionable earnings)
  eiInsurableEarnings   → Box 24 (EI insurable earnings)

  // Deductible employee expenses
  unionDues             → Box 44 (Union dues)
  employerHealthPremiums → Box 85 (Employee-paid health plan premiums — if present)

  // Taxable benefits
  otherTaxableAllowances → Box 40 (Other taxable allowances and benefits)
  dentalBenefitsCode    → Box 45 (Dental benefits code — numeric 1–5, or null)

  // "Other information" boxes at the bottom (variable per slip)
  otherBoxes            → array of { box: string, amount: number | null }

${SHARED_RULES}
`.trim(),

  userPrompt:
    'Extract all tax-relevant fields from this T4 slip into JSON format.',
} as const;

// ─── T3 ───────────────────────────────────────────────────────────────────────

/**
 * T3 — Statement of Trust Income Allocations and Designations
 *
 * Often issued by investment funds (e.g. Wealthsimple, RBC, TD).
 * A single taxpayer may receive multiple T3 slips (one per fund).
 */
export const T3_EXTRACTION = {
  systemInstruction: `
You are an expert Canadian tax assistant specialising in CRA slip extraction.
You are reading a T3 — Statement of Trust Income Allocations and Designations.

Extract the following fields and return them as a single JSON object.

FIELD MAP (key → CRA box):
  documentType                    → always "T3"
  taxYear                         → Year field (top of slip)
  trustName                       → Trust's name and address (issuer, e.g. "Wealthsimple Investments Inc.")
  beneficiaryName                 → Recipient's name
  sin                             → Box 12 (Recipient SIN — 9-digit string, no dashes, NOT a dollar amount)
  accountNumber                   → Box 14 (Account number)
  beneficiaryCode                 → Box 18 (Beneficiary code)
  reportCode                      → Box 16 (Report code)

  // Dividend income
  actualEligibleDividends         → Box 49 (Actual amount of eligible dividends)
  taxableEligibleDividends        → Box 50 (Taxable amount of eligible dividends — grossed-up)
  dividendTaxCreditEligible       → Box 51 (Dividend tax credit for eligible dividends)
  actualOtherDividends            → Box 23 (Actual amount of dividends other than eligible)
  taxableOtherDividends           → Box 32 (Taxable amount of dividends other than eligible)
  dividendTaxCreditOther          → Box 39 (Dividend tax credit for dividends other than eligible)

  // Capital gains
  capitalGains                    → Box 21 (Capital gains)
  capitalGainsEligibleForDeduction → Box 30 (Capital gains eligible for deduction)

  // Other income & foreign amounts
  otherIncome                     → Box 26 (Other income)
  foreignNonBusinessIncome        → Box 25 (Foreign non-business income)
  foreignNonBusinessIncomeTaxPaid → Box 34 (Foreign non-business income tax paid)

  // Other information boxes
  otherBoxes → array of { box: string, amount: number | null }

${SHARED_RULES}
`.trim(),

  userPrompt:
    'Extract all trust income fields from this T3 slip into JSON format.',
} as const;

// ─── T4A ──────────────────────────────────────────────────────────────────────

/**
 * T4A — Statement of Pension, Retirement, Annuity, and Other Income
 * Covers contract/self-employment fees, scholarships, RESP withdrawals, etc.
 */
export const T4A_EXTRACTION = {
  systemInstruction: `
You are an expert Canadian tax assistant specialising in CRA slip extraction.
You are reading a T4A — Statement of Pension, Retirement, Annuity, and Other Income.

Extract the following fields and return them as a single JSON object.

FIELD MAP (key → CRA box):
  documentType           → always "T4A"
  taxYear                → Year field
  payerName              → Payer's name
  sin                    → Box 12 (Recipient's SIN — 9-digit string, no dashes, NOT a dollar amount)

  incomeTaxDeducted      → Box 22 (Income tax deducted)
  pensionOrSuperannuation → Box 016 (Pension or superannuation)
  lumpSumPayments        → Box 018 (Lump-sum payments)
  selfEmployedCommissions → Box 020 (Self-employed commissions)
  annuities              → Box 024 (Annuities)
  feesForServices        → Box 048 (Fees for services — T4A box 048)
  scholarships           → Box 105 (Scholarships, fellowships, bursaries, study grants)
  respEducationalPayments → Box 042 (RESP educational assistance payments)

  otherBoxes → array of { box: string, amount: number | null }

${SHARED_RULES}
`.trim(),

  userPrompt: 'Extract all income fields from this T4A slip into JSON format.',
} as const;

// ─── T5 ───────────────────────────────────────────────────────────────────────

/**
 * T5 — Statement of Investment Income
 * Issued by banks, brokerages, and investment platforms.
 */
export const T5_EXTRACTION = {
  systemInstruction: `
You are an expert Canadian tax assistant specialising in CRA slip extraction.
You are reading a T5 — Statement of Investment Income.

Extract the following fields and return them as a single JSON object.

FIELD MAP (key → CRA box):
  documentType                  → always "T5"
  taxYear                       → Year field
  payerName                     → Payer's name
  sin                           → Box 22 (Recipient's SIN — digits only)
  currency                      → Box 16 (Currency code, e.g. "CAD")

  actualEligibleDividends       → Box 24 (Actual amount of eligible dividends)
  taxableEligibleDividends      → Box 25 (Taxable amount of eligible dividends)
  dividendTaxCreditEligible     → Box 26 (Dividend tax credit for eligible dividends)
  actualOtherDividends          → Box 10 (Actual amount of dividends other than eligible)
  taxableOtherDividends         → Box 11 (Taxable amount of dividends other than eligible)
  dividendTaxCreditOther        → Box 12 (Dividend tax credit for dividends other than eligible)
  interestFromCanadianSources   → Box 13 (Interest from Canadian sources)
  otherIncome                   → Box 14 (Other income from Canadian sources)
  foreignIncome                 → Box 15 (Foreign income)
  foreignTaxPaid                → Box 16 (Foreign tax paid)

  otherBoxes → array of { box: string, amount: number | null }

${SHARED_RULES}
`.trim(),

  userPrompt:
    'Extract all investment income fields from this T5 slip into JSON format.',
} as const;

// ─── T4E ──────────────────────────────────────────────────────────────────────

/**
 * T4E — Statement of Employment Insurance and Other Benefits
 * Issued by Service Canada.
 */
export const T4E_EXTRACTION = {
  systemInstruction: `
You are an expert Canadian tax assistant specialising in CRA slip extraction.
You are reading a T4E — Statement of Employment Insurance and Other Benefits.

Extract the following fields and return them as a single JSON object.

FIELD MAP (key → CRA box):
  documentType            → always "T4E"
  taxYear                 → Year field
  sin                     → Box 12 (SIN — digits only)

  totalBenefitsPaid       → Box 14 (Total benefits paid)
  regularBenefits         → Box 15 (Regular and other benefits)
  maternityPaternityBenefits → Box 17 (Maternity/paternity benefits, if shown)
  incomeTaxDeducted       → Box 22 (Income tax deducted)
  eiInsurableEarnings     → Box 24 (Insurable earnings)
  repayment               → Box 26 (Repayment of EI benefits, if any)

  otherBoxes → array of { box: string, amount: number | null }

${SHARED_RULES}
`.trim(),

  userPrompt:
    'Extract all EI benefit fields from this T4E slip into JSON format.',
} as const;

// ─── T2202 ────────────────────────────────────────────────────────────────────

/**
 * T2202 — Tuition and Enrolment Certificate
 * Issued by Canadian educational institutions.
 */
export const T2202_EXTRACTION = {
  systemInstruction: `
You are an expert Canadian tax assistant specialising in CRA slip extraction.
You are reading a T2202 — Tuition and Enrolment Certificate.

Extract the following fields and return them as a single JSON object.

FIELD MAP:
  documentType           → always "T2202"
  taxYear                → Year of certificate
  institutionName        → Name of educational institution
  sin                    → Student's SIN (digits only)
  studentNumber          → Institution's student number (if present)

  tuitionEligibleFees    → Box 1 (Eligible tuition fees — the claimable amount)
  partTimeMonths         → Box 2 (Number of months enrolled part-time)
  fullTimeMonths         → Box 3 (Number of months enrolled full-time)

  otherBoxes → array of { box: string, amount: number | null }

${SHARED_RULES}
`.trim(),

  userPrompt:
    'Extract all tuition certificate fields from this T2202 into JSON format.',
} as const;

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export type SlipType = 'T3' | 'T4' | 'T4A' | 'T4E' | 'T5' | 'T2202' | 'UNKNOWN';

export interface ExtractionConfig {
  systemInstruction: string;
  userPrompt: string;
}

const SLIP_CONFIGS: Record<string, ExtractionConfig> = {
  T4: T4_EXTRACTION,
  T3: T3_EXTRACTION,
  T4A: T4A_EXTRACTION,
  T5: T5_EXTRACTION,
  T4E: T4E_EXTRACTION,
  T2202: T2202_EXTRACTION,
};

/**
 * A lightweight system instruction used for the first-pass document type detection call.
 * Gemini returns just { "documentType": "T4" } before the full extraction.
 */
export const DOCUMENT_TYPE_DETECTION = {
  systemInstruction: `
You are a Canadian tax document classifier.
Look at the document and return ONLY a JSON object: { "documentType": "<CRA code>" }
Valid codes: T4, T3, T4A, T4E, T4A(P), T5, T5008, T2202, T2200, NR4, UNKNOWN
Do not extract any other fields. Do not include any text outside the JSON.
  `.trim(),
  userPrompt:
    'What type of CRA tax document is this? Return only the documentType JSON.',
} as const;

/**
 * Returns the extraction config for a known slip type.
 * Falls back to a generic config that tries to auto-detect the slip type.
 */
export function getExtractionConfig(slipType: SlipType): ExtractionConfig {
  return (
    SLIP_CONFIGS[slipType] ?? {
      systemInstruction: `
You are an expert Canadian tax assistant.
First identify the document type (e.g. T4, T3, T4A, T5, T4E, T2202).
Then extract all tax-relevant fields as a JSON object.
Set documentType to the CRA code you identify.
${SHARED_RULES}
      `.trim(),
      userPrompt:
        'Identify this tax document type, then extract all tax-relevant fields into JSON format.',
    }
  );
}
