import { z } from 'zod';

// Financial Entry Type Enum
export enum FinancialType {
  income = 'income',
  deduction = 'deduction',
  credit = 'credit',
  taxPaid = 'tax_paid',
}

// Fiscal Entity Type Enum
export enum FiscalEntityType {
  individual = 'individual',
  business = 'business',
  household = 'household',
}

// Tax Document Status Enum
export enum TaxDocumentStatus {
  uploaded = 'uploaded',
  processing = 'processing',
  extracted = 'extracted',
  verified = 'verified',
  rejected = 'rejected',
  failed = 'failed',
}

// Zod enum schemas for validation
export const financialTypeSchema = z.nativeEnum(FinancialType);
export const fiscalEntityTypeSchema = z.nativeEnum(FiscalEntityType);
export const taxDocumentStatusSchema = z.nativeEnum(TaxDocumentStatus);
