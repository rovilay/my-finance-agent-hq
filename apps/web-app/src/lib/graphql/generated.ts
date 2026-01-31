import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type CreateFinancialEntryInput = {
  amount: Scalars['Float']['input'];
  category: Scalars['String']['input'];
  currency?: Scalars['String']['input'];
  date: Scalars['DateTime']['input'];
  entityId: Scalars['String']['input'];
  taxYear: Scalars['String']['input'];
  type: FinancialType;
};

export type Document = {
  __typename?: 'Document';
  createdAt: Scalars['DateTime']['output'];
  decryptedData?: Maybe<Scalars['String']['output']>;
  fileName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  mimeType: Scalars['String']['output'];
  purgedAt?: Maybe<Scalars['DateTime']['output']>;
  retentionPolicy: RetentionPolicy;
  status: DocumentStatus;
  storagePath?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type DocumentInput = {
  entityId: Scalars['String']['input'];
  fileBuffer: Scalars['String']['input'];
  fileName: Scalars['String']['input'];
  mimeType: Scalars['String']['input'];
  retentionPolicy: RetentionPolicy;
  userId: Scalars['String']['input'];
};

export enum DocumentStatus {
  Failed = 'failed',
  Processed = 'processed',
  Purged = 'purged',
  Uploaded = 'uploaded',
  Verified = 'verified'
}

export type FinancialEntry = {
  __typename?: 'FinancialEntry';
  amount: Scalars['Float']['output'];
  category: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  currency: Scalars['String']['output'];
  date: Scalars['DateTime']['output'];
  entityId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  taxYear: Scalars['String']['output'];
  type: FinancialType;
  updatedAt: Scalars['DateTime']['output'];
};

export enum FinancialType {
  Credit = 'credit',
  Deduction = 'deduction',
  Income = 'income',
  TaxPaid = 'tax_paid'
}

export type FiscalEntity = {
  __typename?: 'FiscalEntity';
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  province: Scalars['String']['output'];
  type: FiscalEntityType;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type FiscalEntityInput = {
  name: Scalars['String']['input'];
};

export enum FiscalEntityType {
  Business = 'business',
  Household = 'household',
  Individual = 'individual'
}

export type Mutation = {
  __typename?: 'Mutation';
  addFinancialEntry: FinancialEntry;
  createFiscalEntity: FiscalEntity;
  syncUser: User;
  uploadDocument: Document;
  verifyAndFinalize: Document;
  verifyDocument: Scalars['Boolean']['output'];
};


export type MutationAddFinancialEntryArgs = {
  input: CreateFinancialEntryInput;
};


export type MutationCreateFiscalEntityArgs = {
  input: FiscalEntityInput;
};


export type MutationSyncUserArgs = {
  input: UserInput;
};


export type MutationUploadDocumentArgs = {
  input: DocumentInput;
};


export type MutationVerifyAndFinalizeArgs = {
  documentId: Scalars['ID']['input'];
  shouldKeep: Scalars['Boolean']['input'];
};


export type MutationVerifyDocumentArgs = {
  approved: Scalars['Boolean']['input'];
  documentId: Scalars['ID']['input'];
  shouldKeepFile: Scalars['Boolean']['input'];
};

export type Query = {
  __typename?: 'Query';
  document: Document;
  getFiscalEntities: Array<FiscalEntity>;
  getTaxProjection: TaxProjection;
  ledger: Array<FinancialEntry>;
  me: User;
};


export type QueryDocumentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetTaxProjectionArgs = {
  entityId: Scalars['String']['input'];
  taxYear: Scalars['String']['input'];
};


export type QueryLedgerArgs = {
  entityId: Scalars['String']['input'];
  taxYear?: InputMaybe<Scalars['String']['input']>;
};

export enum RetentionPolicy {
  Ephemeral = 'ephemeral',
  Permanent = 'permanent',
  VerifyAndPurge = 'verify_and_purge'
}

export type TaxProjection = {
  __typename?: 'TaxProjection';
  effectiveTaxRate: Scalars['Float']['output'];
  entityId: Scalars['ID']['output'];
  federalTax: Scalars['Float']['output'];
  provincialTax: Scalars['Float']['output'];
  taxYear: Scalars['String']['output'];
  taxableIncome: Scalars['Float']['output'];
  totalIncome: Scalars['Float']['output'];
  /** Federal + Provincial tax before credits */
  totalTax: Scalars['Float']['output'];
  /** Final amount owed to CRA after credits and prepayments */
  totalTaxLiability: Scalars['Float']['output'];
};

export type User = {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type UserInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
};

export type UploadDocumentMutationVariables = Exact<{
  input: DocumentInput;
}>;


export type UploadDocumentMutation = { __typename?: 'Mutation', uploadDocument: { __typename?: 'Document', id: string, fileName: string, status: DocumentStatus, retentionPolicy: RetentionPolicy, storagePath?: string | null, purgedAt?: any | null, createdAt: any, updatedAt: any, mimeType: string } };

export type GetFiscalEntitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFiscalEntitiesQuery = { __typename?: 'Query', getFiscalEntities: Array<{ __typename?: 'FiscalEntity', id: string, name: string, type: FiscalEntityType, country: string, province: string, userId: string, createdAt: any, updatedAt: any }> };

export type CreateFiscalEntityMutationVariables = Exact<{
  input: FiscalEntityInput;
}>;


export type CreateFiscalEntityMutation = { __typename?: 'Mutation', createFiscalEntity: { __typename?: 'FiscalEntity', id: string, name: string, type: FiscalEntityType, country: string, province: string, userId: string, createdAt: any, updatedAt: any } };

export type GetLedgerQueryVariables = Exact<{
  entityId: Scalars['String']['input'];
  taxYear?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetLedgerQuery = { __typename?: 'Query', ledger: Array<{ __typename?: 'FinancialEntry', id: string, amount: number, category: string, currency: string, date: any, entityId: string, taxYear: string, type: FinancialType, createdAt: any, updatedAt: any }> };

export type AddFinancialEntryMutationVariables = Exact<{
  input: CreateFinancialEntryInput;
}>;


export type AddFinancialEntryMutation = { __typename?: 'Mutation', addFinancialEntry: { __typename?: 'FinancialEntry', id: string, amount: number, category: string, currency: string, date: any, entityId: string, taxYear: string, type: FinancialType, createdAt: any, updatedAt: any } };

export type GetTaxProjectionQueryVariables = Exact<{
  entityId: Scalars['String']['input'];
  taxYear: Scalars['String']['input'];
}>;


export type GetTaxProjectionQuery = { __typename?: 'Query', getTaxProjection: { __typename?: 'TaxProjection', entityId: string, taxYear: string, totalIncome: number, taxableIncome: number, federalTax: number, provincialTax: number, totalTax: number, totalTaxLiability: number, effectiveTaxRate: number } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, avatarUrl?: string | null, bio?: string | null, createdAt: any, updatedAt: any } };

export type SyncUserMutationVariables = Exact<{
  input: UserInput;
}>;


export type SyncUserMutation = { __typename?: 'Mutation', syncUser: { __typename?: 'User', id: string, email: string, firstName: string, lastName: string, avatarUrl?: string | null, bio?: string | null, createdAt: any, updatedAt: any } };


export const UploadDocumentDocument = gql`
    mutation UploadDocument($input: DocumentInput!) {
  uploadDocument(input: $input) {
    id
    fileName
    status
    retentionPolicy
    storagePath
    purgedAt
    createdAt
    updatedAt
    mimeType
  }
}
    `;
export type UploadDocumentMutationFn = Apollo.MutationFunction<UploadDocumentMutation, UploadDocumentMutationVariables>;

/**
 * __useUploadDocumentMutation__
 *
 * To run a mutation, you first call `useUploadDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadDocumentMutation, { data, loading, error }] = useUploadDocumentMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUploadDocumentMutation(baseOptions?: Apollo.MutationHookOptions<UploadDocumentMutation, UploadDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadDocumentMutation, UploadDocumentMutationVariables>(UploadDocumentDocument, options);
      }
export type UploadDocumentMutationHookResult = ReturnType<typeof useUploadDocumentMutation>;
export type UploadDocumentMutationResult = Apollo.MutationResult<UploadDocumentMutation>;
export type UploadDocumentMutationOptions = Apollo.BaseMutationOptions<UploadDocumentMutation, UploadDocumentMutationVariables>;
export const GetFiscalEntitiesDocument = gql`
    query GetFiscalEntities {
  getFiscalEntities {
    id
    name
    type
    country
    province
    userId
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetFiscalEntitiesQuery__
 *
 * To run a query within a React component, call `useGetFiscalEntitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFiscalEntitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFiscalEntitiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFiscalEntitiesQuery(baseOptions?: Apollo.QueryHookOptions<GetFiscalEntitiesQuery, GetFiscalEntitiesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFiscalEntitiesQuery, GetFiscalEntitiesQueryVariables>(GetFiscalEntitiesDocument, options);
      }
export function useGetFiscalEntitiesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFiscalEntitiesQuery, GetFiscalEntitiesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFiscalEntitiesQuery, GetFiscalEntitiesQueryVariables>(GetFiscalEntitiesDocument, options);
        }
// @ts-ignore
export function useGetFiscalEntitiesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetFiscalEntitiesQuery, GetFiscalEntitiesQueryVariables>): Apollo.UseSuspenseQueryResult<GetFiscalEntitiesQuery, GetFiscalEntitiesQueryVariables>;
export function useGetFiscalEntitiesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFiscalEntitiesQuery, GetFiscalEntitiesQueryVariables>): Apollo.UseSuspenseQueryResult<GetFiscalEntitiesQuery | undefined, GetFiscalEntitiesQueryVariables>;
export function useGetFiscalEntitiesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFiscalEntitiesQuery, GetFiscalEntitiesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFiscalEntitiesQuery, GetFiscalEntitiesQueryVariables>(GetFiscalEntitiesDocument, options);
        }
export type GetFiscalEntitiesQueryHookResult = ReturnType<typeof useGetFiscalEntitiesQuery>;
export type GetFiscalEntitiesLazyQueryHookResult = ReturnType<typeof useGetFiscalEntitiesLazyQuery>;
export type GetFiscalEntitiesSuspenseQueryHookResult = ReturnType<typeof useGetFiscalEntitiesSuspenseQuery>;
export type GetFiscalEntitiesQueryResult = Apollo.QueryResult<GetFiscalEntitiesQuery, GetFiscalEntitiesQueryVariables>;
export const CreateFiscalEntityDocument = gql`
    mutation CreateFiscalEntity($input: FiscalEntityInput!) {
  createFiscalEntity(input: $input) {
    id
    name
    type
    country
    province
    userId
    createdAt
    updatedAt
  }
}
    `;
export type CreateFiscalEntityMutationFn = Apollo.MutationFunction<CreateFiscalEntityMutation, CreateFiscalEntityMutationVariables>;

/**
 * __useCreateFiscalEntityMutation__
 *
 * To run a mutation, you first call `useCreateFiscalEntityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFiscalEntityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFiscalEntityMutation, { data, loading, error }] = useCreateFiscalEntityMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateFiscalEntityMutation(baseOptions?: Apollo.MutationHookOptions<CreateFiscalEntityMutation, CreateFiscalEntityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFiscalEntityMutation, CreateFiscalEntityMutationVariables>(CreateFiscalEntityDocument, options);
      }
export type CreateFiscalEntityMutationHookResult = ReturnType<typeof useCreateFiscalEntityMutation>;
export type CreateFiscalEntityMutationResult = Apollo.MutationResult<CreateFiscalEntityMutation>;
export type CreateFiscalEntityMutationOptions = Apollo.BaseMutationOptions<CreateFiscalEntityMutation, CreateFiscalEntityMutationVariables>;
export const GetLedgerDocument = gql`
    query GetLedger($entityId: String!, $taxYear: String) {
  ledger(entityId: $entityId, taxYear: $taxYear) {
    id
    amount
    category
    currency
    date
    entityId
    taxYear
    type
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetLedgerQuery__
 *
 * To run a query within a React component, call `useGetLedgerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLedgerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLedgerQuery({
 *   variables: {
 *      entityId: // value for 'entityId'
 *      taxYear: // value for 'taxYear'
 *   },
 * });
 */
export function useGetLedgerQuery(baseOptions: Apollo.QueryHookOptions<GetLedgerQuery, GetLedgerQueryVariables> & ({ variables: GetLedgerQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLedgerQuery, GetLedgerQueryVariables>(GetLedgerDocument, options);
      }
export function useGetLedgerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLedgerQuery, GetLedgerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLedgerQuery, GetLedgerQueryVariables>(GetLedgerDocument, options);
        }
// @ts-ignore
export function useGetLedgerSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetLedgerQuery, GetLedgerQueryVariables>): Apollo.UseSuspenseQueryResult<GetLedgerQuery, GetLedgerQueryVariables>;
export function useGetLedgerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLedgerQuery, GetLedgerQueryVariables>): Apollo.UseSuspenseQueryResult<GetLedgerQuery | undefined, GetLedgerQueryVariables>;
export function useGetLedgerSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLedgerQuery, GetLedgerQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLedgerQuery, GetLedgerQueryVariables>(GetLedgerDocument, options);
        }
export type GetLedgerQueryHookResult = ReturnType<typeof useGetLedgerQuery>;
export type GetLedgerLazyQueryHookResult = ReturnType<typeof useGetLedgerLazyQuery>;
export type GetLedgerSuspenseQueryHookResult = ReturnType<typeof useGetLedgerSuspenseQuery>;
export type GetLedgerQueryResult = Apollo.QueryResult<GetLedgerQuery, GetLedgerQueryVariables>;
export const AddFinancialEntryDocument = gql`
    mutation AddFinancialEntry($input: CreateFinancialEntryInput!) {
  addFinancialEntry(input: $input) {
    id
    amount
    category
    currency
    date
    entityId
    taxYear
    type
    createdAt
    updatedAt
  }
}
    `;
export type AddFinancialEntryMutationFn = Apollo.MutationFunction<AddFinancialEntryMutation, AddFinancialEntryMutationVariables>;

/**
 * __useAddFinancialEntryMutation__
 *
 * To run a mutation, you first call `useAddFinancialEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddFinancialEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addFinancialEntryMutation, { data, loading, error }] = useAddFinancialEntryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddFinancialEntryMutation(baseOptions?: Apollo.MutationHookOptions<AddFinancialEntryMutation, AddFinancialEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddFinancialEntryMutation, AddFinancialEntryMutationVariables>(AddFinancialEntryDocument, options);
      }
export type AddFinancialEntryMutationHookResult = ReturnType<typeof useAddFinancialEntryMutation>;
export type AddFinancialEntryMutationResult = Apollo.MutationResult<AddFinancialEntryMutation>;
export type AddFinancialEntryMutationOptions = Apollo.BaseMutationOptions<AddFinancialEntryMutation, AddFinancialEntryMutationVariables>;
export const GetTaxProjectionDocument = gql`
    query GetTaxProjection($entityId: String!, $taxYear: String!) {
  getTaxProjection(entityId: $entityId, taxYear: $taxYear) {
    entityId
    taxYear
    totalIncome
    taxableIncome
    federalTax
    provincialTax
    totalTax
    totalTaxLiability
    effectiveTaxRate
  }
}
    `;

/**
 * __useGetTaxProjectionQuery__
 *
 * To run a query within a React component, call `useGetTaxProjectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTaxProjectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTaxProjectionQuery({
 *   variables: {
 *      entityId: // value for 'entityId'
 *      taxYear: // value for 'taxYear'
 *   },
 * });
 */
export function useGetTaxProjectionQuery(baseOptions: Apollo.QueryHookOptions<GetTaxProjectionQuery, GetTaxProjectionQueryVariables> & ({ variables: GetTaxProjectionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTaxProjectionQuery, GetTaxProjectionQueryVariables>(GetTaxProjectionDocument, options);
      }
export function useGetTaxProjectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTaxProjectionQuery, GetTaxProjectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTaxProjectionQuery, GetTaxProjectionQueryVariables>(GetTaxProjectionDocument, options);
        }
// @ts-ignore
export function useGetTaxProjectionSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetTaxProjectionQuery, GetTaxProjectionQueryVariables>): Apollo.UseSuspenseQueryResult<GetTaxProjectionQuery, GetTaxProjectionQueryVariables>;
export function useGetTaxProjectionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTaxProjectionQuery, GetTaxProjectionQueryVariables>): Apollo.UseSuspenseQueryResult<GetTaxProjectionQuery | undefined, GetTaxProjectionQueryVariables>;
export function useGetTaxProjectionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTaxProjectionQuery, GetTaxProjectionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTaxProjectionQuery, GetTaxProjectionQueryVariables>(GetTaxProjectionDocument, options);
        }
export type GetTaxProjectionQueryHookResult = ReturnType<typeof useGetTaxProjectionQuery>;
export type GetTaxProjectionLazyQueryHookResult = ReturnType<typeof useGetTaxProjectionLazyQuery>;
export type GetTaxProjectionSuspenseQueryHookResult = ReturnType<typeof useGetTaxProjectionSuspenseQuery>;
export type GetTaxProjectionQueryResult = Apollo.QueryResult<GetTaxProjectionQuery, GetTaxProjectionQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    email
    firstName
    lastName
    avatarUrl
    bio
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
// @ts-ignore
export function useMeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>): Apollo.UseSuspenseQueryResult<MeQuery, MeQueryVariables>;
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>): Apollo.UseSuspenseQueryResult<MeQuery | undefined, MeQueryVariables>;
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const SyncUserDocument = gql`
    mutation SyncUser($input: UserInput!) {
  syncUser(input: $input) {
    id
    email
    firstName
    lastName
    avatarUrl
    bio
    createdAt
    updatedAt
  }
}
    `;
export type SyncUserMutationFn = Apollo.MutationFunction<SyncUserMutation, SyncUserMutationVariables>;

/**
 * __useSyncUserMutation__
 *
 * To run a mutation, you first call `useSyncUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSyncUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [syncUserMutation, { data, loading, error }] = useSyncUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSyncUserMutation(baseOptions?: Apollo.MutationHookOptions<SyncUserMutation, SyncUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SyncUserMutation, SyncUserMutationVariables>(SyncUserDocument, options);
      }
export type SyncUserMutationHookResult = ReturnType<typeof useSyncUserMutation>;
export type SyncUserMutationResult = Apollo.MutationResult<SyncUserMutation>;
export type SyncUserMutationOptions = Apollo.BaseMutationOptions<SyncUserMutation, SyncUserMutationVariables>;