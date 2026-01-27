# @hq/validation-schema

Shared Zod validation schemas for the Finance HQ application. This package provides consistent validation across frontend and backend.

## Installation

This package is part of the monorepo and is automatically available to other packages via workspace references.

```json
{
  "dependencies": {
    "@hq/validation-schema": "workspace:*"
  }
}
```

## Usage

### Import schemas

```typescript
import {
  createFinancialEntrySchema,
  CreateFinancialEntryInput,
  FinancialType,
} from '@hq/validation-schema';
```

### Validate data

```typescript
const result = createFinancialEntrySchema.safeParse(data);

if (result.success) {
  // data is valid
  console.log(result.data);
} else {
  // validation errors
  console.error(result.error.errors);
}
```

### Use types

```typescript
function createEntry(input: CreateFinancialEntryInput) {
  // input is type-safe
}
```

## Available Schemas

### Financial Entry

- `createFinancialEntrySchema` - Create financial entry validation
- `updateFinancialEntrySchema` - Update financial entry validation
- `getFinancialEntriesSchema` - Query filters validation

### Fiscal Entity

- `createFiscalEntitySchema` - Create fiscal entity validation
- `updateFiscalEntitySchema` - Update fiscal entity validation

### User

- `createUserSchema` - Create user validation
- `updateUserSchema` - Update user validation

### Tax Document

- `createTaxDocumentSchema` - Create tax document validation
- `updateTaxDocumentSchema` - Update tax document validation

### Enums

- `FinancialType` - income, deduction, credit, tax_paid
- `FiscalEntityType` - individual, business, household
- `TaxDocumentStatus` - uploaded, processing, extracted, verified, rejected, failed

## Benefits

✅ **Type-safe** - Automatic TypeScript types from schemas  
✅ **Consistent** - Same validation rules on frontend and backend  
✅ **DRY** - Single source of truth for validation logic  
✅ **Error messages** - Clear, user-friendly validation errors  
✅ **Runtime safety** - Catch invalid data before it reaches your database
