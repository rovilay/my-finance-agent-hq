import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any };
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
  entityId: Scalars['ID']['output'];
  fileMetadata: FileMetadata;
  fileName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  purgedAt?: Maybe<Scalars['DateTime']['output']>;
  retentionPolicy: RetentionPolicy;
  status: DocumentStatus;
  storagePath?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum DocumentStatus {
  Failed = 'failed',
  Processed = 'processed',
  Purged = 'purged',
  Uploaded = 'uploaded',
  Verified = 'verified',
}

export type ExtractFinancialEntryInput = {
  documentId: Scalars['String']['input'];
};

export type ExtractedFinancialEntry = {
  __typename?: 'ExtractedFinancialEntry';
  amount?: Maybe<Scalars['Float']['output']>;
  category?: Maybe<Scalars['String']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  date?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  taxYear?: Maybe<Scalars['String']['output']>;
  type?: Maybe<FinancialType>;
};

export type FileMetadata = {
  __typename?: 'FileMetadata';
  mimeType: Scalars['String']['output'];
  sizeInKb: Scalars['Float']['output'];
};

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
  TaxPaid = 'taxPaid',
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
  type: FiscalEntityType;
};

export enum FiscalEntityType {
  Business = 'business',
  Household = 'household',
  Individual = 'individual',
}

export type Mutation = {
  __typename?: 'Mutation';
  addFinancialEntry: FinancialEntry;
  createFiscalEntity: FiscalEntity;
  deleteFiscalEntity: Scalars['Boolean']['output'];
  extractFinancialEntry: ExtractedFinancialEntry;
  syncUser: User;
  updateFiscalEntity: FiscalEntity;
  verifyAndFinalize: Document;
  verifyDocument: Scalars['Boolean']['output'];
};

export type MutationAddFinancialEntryArgs = {
  input: CreateFinancialEntryInput;
};

export type MutationCreateFiscalEntityArgs = {
  input: FiscalEntityInput;
};

export type MutationDeleteFiscalEntityArgs = {
  id: Scalars['ID']['input'];
};

export type MutationExtractFinancialEntryArgs = {
  input: ExtractFinancialEntryInput;
};

export type MutationSyncUserArgs = {
  input: UserInput;
};

export type MutationUpdateFiscalEntityArgs = {
  id: Scalars['ID']['input'];
  input: UpdateFiscalEntityInput;
};

export type MutationVerifyAndFinalizeArgs = {
  approved: Scalars['Boolean']['input'];
  documentId: Scalars['ID']['input'];
  shouldKeep?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MutationVerifyDocumentArgs = {
  approved: Scalars['Boolean']['input'];
  documentId: Scalars['ID']['input'];
  shouldKeepFile: Scalars['Boolean']['input'];
};

export type PaginatedDocument = {
  __typename?: 'PaginatedDocument';
  hasMore: Scalars['Boolean']['output'];
  items: Array<Document>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PaginatedFinancialEntry = {
  __typename?: 'PaginatedFinancialEntry';
  hasMore: Scalars['Boolean']['output'];
  items: Array<FinancialEntry>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PaginatedFiscalEntity = {
  __typename?: 'PaginatedFiscalEntity';
  hasMore: Scalars['Boolean']['output'];
  items: Array<FiscalEntity>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PaginationInput = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  document: Document;
  documentsByEntity: PaginatedDocument;
  financialEntries: PaginatedFinancialEntry;
  financialEntry: FinancialEntry;
  fiscalEntities: PaginatedFiscalEntity;
  fiscalEntity: FiscalEntity;
  getTaxProjection: TaxProjection;
  me: User;
};

export type QueryDocumentArgs = {
  id: Scalars['ID']['input'];
};

export type QueryDocumentsByEntityArgs = {
  entityId: Scalars['ID']['input'];
  pagination?: InputMaybe<PaginationInput>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFinancialEntriesArgs = {
  entityId: Scalars['ID']['input'];
  pagination?: InputMaybe<PaginationInput>;
  taxYear?: InputMaybe<Scalars['String']['input']>;
};

export type QueryFinancialEntryArgs = {
  id: Scalars['ID']['input'];
};

export type QueryFiscalEntitiesArgs = {
  fiscalEntityType?: InputMaybe<FiscalEntityType>;
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryFiscalEntityArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGetTaxProjectionArgs = {
  entityId: Scalars['String']['input'];
  taxYear: Scalars['String']['input'];
};

export enum RetentionPolicy {
  Ephemeral = 'ephemeral',
  Permanent = 'permanent',
  VerifyAndPurge = 'verify_and_purge',
}

export type TaxProjection = {
  __typename?: 'TaxProjection';
  /** Total credits applied (includes automatic BPA and user-entered credits) */
  creditsApplied: Scalars['Float']['output'];
  /** Total user-entered credits (not including automatic BPA) */
  creditsTotal: Scalars['Float']['output'];
  /** Total deductions from all deduction entries */
  deductionsTotal: Scalars['Float']['output'];
  effectiveTaxRate: Scalars['Float']['output'];
  entityId: Scalars['ID']['output'];
  federalTax: Scalars['Float']['output'];
  /** Total income from all income entries */
  incomeTotal: Scalars['Float']['output'];
  provincialTax: Scalars['Float']['output'];
  /** Total tax already paid throughout the year */
  taxPaidTotal: Scalars['Float']['output'];
  taxYear: Scalars['String']['output'];
  taxableIncome: Scalars['Float']['output'];
  totalIncome: Scalars['Float']['output'];
  /** Federal + Provincial tax before credits */
  totalTax: Scalars['Float']['output'];
  /** Final amount owed to CRA after credits and prepayments */
  totalTaxLiability: Scalars['Float']['output'];
};

export type UpdateFiscalEntityInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<FiscalEntityType>;
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

export type VerifyAndFinalizeDocumentMutationVariables = Exact<{
  documentId: Scalars['ID']['input'];
  approved: Scalars['Boolean']['input'];
  shouldKeepFile?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type VerifyAndFinalizeDocumentMutation = {
  __typename?: 'Mutation';
  verifyAndFinalize: { __typename?: 'Document'; id: string; status: DocumentStatus };
};

export type GetDocumentsByEntityQueryVariables = Exact<{
  entityId: Scalars['ID']['input'];
  pagination?: InputMaybe<PaginationInput>;
  status?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetDocumentsByEntityQuery = {
  __typename?: 'Query';
  documentsByEntity: {
    __typename?: 'PaginatedDocument';
    total: number;
    skip: number;
    take: number;
    hasMore: boolean;
    items: Array<{
      __typename?: 'Document';
      id: string;
      entityId: string;
      fileName: string;
      status: DocumentStatus;
      retentionPolicy: RetentionPolicy;
      storagePath?: string | null;
      purgedAt?: any | null;
      decryptedData?: string | null;
      createdAt: any;
      updatedAt: any;
      fileMetadata: { __typename?: 'FileMetadata'; mimeType: string; sizeInKb: number };
    }>;
  };
};

export type GetDocumentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetDocumentQuery = {
  __typename?: 'Query';
  document: {
    __typename?: 'Document';
    id: string;
    entityId: string;
    fileName: string;
    status: DocumentStatus;
    retentionPolicy: RetentionPolicy;
    storagePath?: string | null;
    purgedAt?: any | null;
    createdAt: any;
    updatedAt: any;
    decryptedData?: string | null;
    fileMetadata: { __typename?: 'FileMetadata'; mimeType: string; sizeInKb: number };
  };
};

export type GetFiscalEntitiesQueryVariables = Exact<{
  type?: InputMaybe<FiscalEntityType>;
  pagination?: InputMaybe<PaginationInput>;
}>;

export type GetFiscalEntitiesQuery = {
  __typename?: 'Query';
  fiscalEntities: {
    __typename?: 'PaginatedFiscalEntity';
    total: number;
    skip: number;
    take: number;
    hasMore: boolean;
    items: Array<{
      __typename?: 'FiscalEntity';
      id: string;
      name: string;
      type: FiscalEntityType;
      country: string;
      province: string;
      userId: string;
      createdAt: any;
      updatedAt: any;
    }>;
  };
};

export type GetFiscalEntityQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetFiscalEntityQuery = {
  __typename?: 'Query';
  fiscalEntity: {
    __typename?: 'FiscalEntity';
    id: string;
    name: string;
    type: FiscalEntityType;
    country: string;
    province: string;
    userId: string;
    createdAt: any;
    updatedAt: any;
  };
};

export type CreateFiscalEntityMutationVariables = Exact<{
  input: FiscalEntityInput;
}>;

export type CreateFiscalEntityMutation = {
  __typename?: 'Mutation';
  createFiscalEntity: {
    __typename?: 'FiscalEntity';
    id: string;
    name: string;
    type: FiscalEntityType;
    country: string;
    province: string;
    userId: string;
    createdAt: any;
    updatedAt: any;
  };
};

export type UpdateFiscalEntityMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateFiscalEntityInput;
}>;

export type UpdateFiscalEntityMutation = {
  __typename?: 'Mutation';
  updateFiscalEntity: {
    __typename?: 'FiscalEntity';
    id: string;
    name: string;
    type: FiscalEntityType;
    country: string;
    province: string;
    userId: string;
    createdAt: any;
    updatedAt: any;
  };
};

export type DeleteFiscalEntityMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type DeleteFiscalEntityMutation = { __typename?: 'Mutation'; deleteFiscalEntity: boolean };

export type GetLedgerQueryVariables = Exact<{
  entityId: Scalars['ID']['input'];
  pagination?: InputMaybe<PaginationInput>;
  taxYear?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetLedgerQuery = {
  __typename?: 'Query';
  financialEntries: {
    __typename?: 'PaginatedFinancialEntry';
    total: number;
    skip: number;
    take: number;
    hasMore: boolean;
    items: Array<{
      __typename?: 'FinancialEntry';
      id: string;
      amount: number;
      category: string;
      currency: string;
      date: any;
      entityId: string;
      taxYear: string;
      type: FinancialType;
      createdAt: any;
      updatedAt: any;
    }>;
  };
};

export type GetFinancialEntryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type GetFinancialEntryQuery = {
  __typename?: 'Query';
  financialEntry: {
    __typename?: 'FinancialEntry';
    id: string;
    amount: number;
    category: string;
    currency: string;
    date: any;
    entityId: string;
    taxYear: string;
    type: FinancialType;
    createdAt: any;
    updatedAt: any;
  };
};

export type AddFinancialEntryMutationVariables = Exact<{
  input: CreateFinancialEntryInput;
}>;

export type AddFinancialEntryMutation = {
  __typename?: 'Mutation';
  addFinancialEntry: {
    __typename?: 'FinancialEntry';
    id: string;
    amount: number;
    category: string;
    currency: string;
    date: any;
    entityId: string;
    taxYear: string;
    type: FinancialType;
    createdAt: any;
    updatedAt: any;
  };
};

export type ExtractFinancialEntryMutationVariables = Exact<{
  input: ExtractFinancialEntryInput;
}>;

export type ExtractFinancialEntryMutation = {
  __typename?: 'Mutation';
  extractFinancialEntry: {
    __typename?: 'ExtractedFinancialEntry';
    date?: string | null;
    amount?: number | null;
    currency?: string | null;
    category?: string | null;
    description?: string | null;
    taxYear?: string | null;
    type?: FinancialType | null;
  };
};

export type GetTaxProjectionQueryVariables = Exact<{
  entityId: Scalars['String']['input'];
  taxYear: Scalars['String']['input'];
}>;

export type GetTaxProjectionQuery = {
  __typename?: 'Query';
  getTaxProjection: {
    __typename?: 'TaxProjection';
    entityId: string;
    taxYear: string;
    totalIncome: number;
    taxableIncome: number;
    federalTax: number;
    provincialTax: number;
    totalTax: number;
    creditsApplied: number;
    totalTaxLiability: number;
    effectiveTaxRate: number;
    incomeTotal: number;
    deductionsTotal: number;
    creditsTotal: number;
    taxPaidTotal: number;
  };
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: 'Query';
  me: {
    __typename?: 'User';
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
    bio?: string | null;
    createdAt: any;
    updatedAt: any;
  };
};

export type SyncUserMutationVariables = Exact<{
  input: UserInput;
}>;

export type SyncUserMutation = {
  __typename?: 'Mutation';
  syncUser: {
    __typename?: 'User';
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
    bio?: string | null;
    createdAt: any;
    updatedAt: any;
  };
};

export const VerifyAndFinalizeDocumentDocument = gql`
  mutation VerifyAndFinalizeDocument(
    $documentId: ID!
    $approved: Boolean!
    $shouldKeepFile: Boolean
  ) {
    verifyAndFinalize(documentId: $documentId, approved: $approved, shouldKeep: $shouldKeepFile) {
      id
      status
    }
  }
`;
export type VerifyAndFinalizeDocumentMutationFn = Apollo.MutationFunction<
  VerifyAndFinalizeDocumentMutation,
  VerifyAndFinalizeDocumentMutationVariables
>;

/**
 * __useVerifyAndFinalizeDocumentMutation__
 *
 * To run a mutation, you first call `useVerifyAndFinalizeDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyAndFinalizeDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyAndFinalizeDocumentMutation, { data, loading, error }] = useVerifyAndFinalizeDocumentMutation({
 *   variables: {
 *      documentId: // value for 'documentId'
 *      approved: // value for 'approved'
 *      shouldKeepFile: // value for 'shouldKeepFile'
 *   },
 * });
 */
export function useVerifyAndFinalizeDocumentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    VerifyAndFinalizeDocumentMutation,
    VerifyAndFinalizeDocumentMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    VerifyAndFinalizeDocumentMutation,
    VerifyAndFinalizeDocumentMutationVariables
  >(VerifyAndFinalizeDocumentDocument, options);
}
export type VerifyAndFinalizeDocumentMutationHookResult = ReturnType<
  typeof useVerifyAndFinalizeDocumentMutation
>;
export type VerifyAndFinalizeDocumentMutationResult =
  Apollo.MutationResult<VerifyAndFinalizeDocumentMutation>;
export type VerifyAndFinalizeDocumentMutationOptions = Apollo.BaseMutationOptions<
  VerifyAndFinalizeDocumentMutation,
  VerifyAndFinalizeDocumentMutationVariables
>;
export const GetDocumentsByEntityDocument = gql`
  query GetDocumentsByEntity($entityId: ID!, $pagination: PaginationInput, $status: String) {
    documentsByEntity(entityId: $entityId, pagination: $pagination, status: $status) {
      items {
        id
        entityId
        fileName
        status
        retentionPolicy
        storagePath
        purgedAt
        decryptedData
        createdAt
        updatedAt
        fileMetadata {
          mimeType
          sizeInKb
        }
      }
      total
      skip
      take
      hasMore
    }
  }
`;

/**
 * __useGetDocumentsByEntityQuery__
 *
 * To run a query within a React component, call `useGetDocumentsByEntityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocumentsByEntityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocumentsByEntityQuery({
 *   variables: {
 *      entityId: // value for 'entityId'
 *      pagination: // value for 'pagination'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useGetDocumentsByEntityQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetDocumentsByEntityQuery,
    GetDocumentsByEntityQueryVariables
  > &
    ({ variables: GetDocumentsByEntityQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetDocumentsByEntityQuery, GetDocumentsByEntityQueryVariables>(
    GetDocumentsByEntityDocument,
    options
  );
}
export function useGetDocumentsByEntityLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDocumentsByEntityQuery,
    GetDocumentsByEntityQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetDocumentsByEntityQuery, GetDocumentsByEntityQueryVariables>(
    GetDocumentsByEntityDocument,
    options
  );
}
// @ts-ignore
export function useGetDocumentsByEntitySuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetDocumentsByEntityQuery,
    GetDocumentsByEntityQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetDocumentsByEntityQuery, GetDocumentsByEntityQueryVariables>;
export function useGetDocumentsByEntitySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetDocumentsByEntityQuery, GetDocumentsByEntityQueryVariables>
): Apollo.UseSuspenseQueryResult<
  GetDocumentsByEntityQuery | undefined,
  GetDocumentsByEntityQueryVariables
>;
export function useGetDocumentsByEntitySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetDocumentsByEntityQuery, GetDocumentsByEntityQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetDocumentsByEntityQuery, GetDocumentsByEntityQueryVariables>(
    GetDocumentsByEntityDocument,
    options
  );
}
export type GetDocumentsByEntityQueryHookResult = ReturnType<typeof useGetDocumentsByEntityQuery>;
export type GetDocumentsByEntityLazyQueryHookResult = ReturnType<
  typeof useGetDocumentsByEntityLazyQuery
>;
export type GetDocumentsByEntitySuspenseQueryHookResult = ReturnType<
  typeof useGetDocumentsByEntitySuspenseQuery
>;
export type GetDocumentsByEntityQueryResult = Apollo.QueryResult<
  GetDocumentsByEntityQuery,
  GetDocumentsByEntityQueryVariables
>;
export const GetDocumentDocument = gql`
  query GetDocument($id: ID!) {
    document(id: $id) {
      id
      entityId
      fileName
      status
      retentionPolicy
      storagePath
      purgedAt
      createdAt
      updatedAt
      decryptedData
      fileMetadata {
        mimeType
        sizeInKb
      }
    }
  }
`;

/**
 * __useGetDocumentQuery__
 *
 * To run a query within a React component, call `useGetDocumentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocumentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocumentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetDocumentQuery(
  baseOptions: Apollo.QueryHookOptions<GetDocumentQuery, GetDocumentQueryVariables> &
    ({ variables: GetDocumentQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetDocumentQuery, GetDocumentQueryVariables>(GetDocumentDocument, options);
}
export function useGetDocumentLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetDocumentQuery, GetDocumentQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetDocumentQuery, GetDocumentQueryVariables>(
    GetDocumentDocument,
    options
  );
}
// @ts-ignore
export function useGetDocumentSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GetDocumentQuery, GetDocumentQueryVariables>
): Apollo.UseSuspenseQueryResult<GetDocumentQuery, GetDocumentQueryVariables>;
export function useGetDocumentSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetDocumentQuery, GetDocumentQueryVariables>
): Apollo.UseSuspenseQueryResult<GetDocumentQuery | undefined, GetDocumentQueryVariables>;
export function useGetDocumentSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetDocumentQuery, GetDocumentQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetDocumentQuery, GetDocumentQueryVariables>(
    GetDocumentDocument,
    options
  );
}
export type GetDocumentQueryHookResult = ReturnType<typeof useGetDocumentQuery>;
export type GetDocumentLazyQueryHookResult = ReturnType<typeof useGetDocumentLazyQuery>;
export type GetDocumentSuspenseQueryHookResult = ReturnType<typeof useGetDocumentSuspenseQuery>;
export type GetDocumentQueryResult = Apollo.QueryResult<
  GetDocumentQuery,
  GetDocumentQueryVariables
>;
export const GetFiscalEntitiesDocument = gql`
  query GetFiscalEntities($type: FiscalEntityType, $pagination: PaginationInput) {
    fiscalEntities(fiscalEntityType: $type, pagination: $pagination) {
      items {
        id
        name
        type
        country
        province
        userId
        createdAt
        updatedAt
      }
      total
      skip
      take
      hasMore
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
 *      type: // value for 'type'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetFiscalEntitiesQuery(
  baseOptions?: Apollo.QueryHookOptions<GetFiscalEntitiesQuery, GetFiscalEntitiesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetFiscalEntitiesQuery, GetFiscalEntitiesQueryVariables>(
    GetFiscalEntitiesDocument,
    options
  );
}
export function useGetFiscalEntitiesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetFiscalEntitiesQuery, GetFiscalEntitiesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetFiscalEntitiesQuery, GetFiscalEntitiesQueryVariables>(
    GetFiscalEntitiesDocument,
    options
  );
}
// @ts-ignore
export function useGetFiscalEntitiesSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetFiscalEntitiesQuery,
    GetFiscalEntitiesQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetFiscalEntitiesQuery, GetFiscalEntitiesQueryVariables>;
export function useGetFiscalEntitiesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetFiscalEntitiesQuery, GetFiscalEntitiesQueryVariables>
): Apollo.UseSuspenseQueryResult<
  GetFiscalEntitiesQuery | undefined,
  GetFiscalEntitiesQueryVariables
>;
export function useGetFiscalEntitiesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetFiscalEntitiesQuery, GetFiscalEntitiesQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetFiscalEntitiesQuery, GetFiscalEntitiesQueryVariables>(
    GetFiscalEntitiesDocument,
    options
  );
}
export type GetFiscalEntitiesQueryHookResult = ReturnType<typeof useGetFiscalEntitiesQuery>;
export type GetFiscalEntitiesLazyQueryHookResult = ReturnType<typeof useGetFiscalEntitiesLazyQuery>;
export type GetFiscalEntitiesSuspenseQueryHookResult = ReturnType<
  typeof useGetFiscalEntitiesSuspenseQuery
>;
export type GetFiscalEntitiesQueryResult = Apollo.QueryResult<
  GetFiscalEntitiesQuery,
  GetFiscalEntitiesQueryVariables
>;
export const GetFiscalEntityDocument = gql`
  query GetFiscalEntity($id: ID!) {
    fiscalEntity(id: $id) {
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
 * __useGetFiscalEntityQuery__
 *
 * To run a query within a React component, call `useGetFiscalEntityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFiscalEntityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFiscalEntityQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetFiscalEntityQuery(
  baseOptions: Apollo.QueryHookOptions<GetFiscalEntityQuery, GetFiscalEntityQueryVariables> &
    ({ variables: GetFiscalEntityQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetFiscalEntityQuery, GetFiscalEntityQueryVariables>(
    GetFiscalEntityDocument,
    options
  );
}
export function useGetFiscalEntityLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetFiscalEntityQuery, GetFiscalEntityQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetFiscalEntityQuery, GetFiscalEntityQueryVariables>(
    GetFiscalEntityDocument,
    options
  );
}
// @ts-ignore
export function useGetFiscalEntitySuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GetFiscalEntityQuery, GetFiscalEntityQueryVariables>
): Apollo.UseSuspenseQueryResult<GetFiscalEntityQuery, GetFiscalEntityQueryVariables>;
export function useGetFiscalEntitySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetFiscalEntityQuery, GetFiscalEntityQueryVariables>
): Apollo.UseSuspenseQueryResult<GetFiscalEntityQuery | undefined, GetFiscalEntityQueryVariables>;
export function useGetFiscalEntitySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetFiscalEntityQuery, GetFiscalEntityQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetFiscalEntityQuery, GetFiscalEntityQueryVariables>(
    GetFiscalEntityDocument,
    options
  );
}
export type GetFiscalEntityQueryHookResult = ReturnType<typeof useGetFiscalEntityQuery>;
export type GetFiscalEntityLazyQueryHookResult = ReturnType<typeof useGetFiscalEntityLazyQuery>;
export type GetFiscalEntitySuspenseQueryHookResult = ReturnType<
  typeof useGetFiscalEntitySuspenseQuery
>;
export type GetFiscalEntityQueryResult = Apollo.QueryResult<
  GetFiscalEntityQuery,
  GetFiscalEntityQueryVariables
>;
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
export type CreateFiscalEntityMutationFn = Apollo.MutationFunction<
  CreateFiscalEntityMutation,
  CreateFiscalEntityMutationVariables
>;

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
export function useCreateFiscalEntityMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateFiscalEntityMutation,
    CreateFiscalEntityMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateFiscalEntityMutation, CreateFiscalEntityMutationVariables>(
    CreateFiscalEntityDocument,
    options
  );
}
export type CreateFiscalEntityMutationHookResult = ReturnType<typeof useCreateFiscalEntityMutation>;
export type CreateFiscalEntityMutationResult = Apollo.MutationResult<CreateFiscalEntityMutation>;
export type CreateFiscalEntityMutationOptions = Apollo.BaseMutationOptions<
  CreateFiscalEntityMutation,
  CreateFiscalEntityMutationVariables
>;
export const UpdateFiscalEntityDocument = gql`
  mutation UpdateFiscalEntity($id: ID!, $input: UpdateFiscalEntityInput!) {
    updateFiscalEntity(id: $id, input: $input) {
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
export type UpdateFiscalEntityMutationFn = Apollo.MutationFunction<
  UpdateFiscalEntityMutation,
  UpdateFiscalEntityMutationVariables
>;

/**
 * __useUpdateFiscalEntityMutation__
 *
 * To run a mutation, you first call `useUpdateFiscalEntityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFiscalEntityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFiscalEntityMutation, { data, loading, error }] = useUpdateFiscalEntityMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateFiscalEntityMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateFiscalEntityMutation,
    UpdateFiscalEntityMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateFiscalEntityMutation, UpdateFiscalEntityMutationVariables>(
    UpdateFiscalEntityDocument,
    options
  );
}
export type UpdateFiscalEntityMutationHookResult = ReturnType<typeof useUpdateFiscalEntityMutation>;
export type UpdateFiscalEntityMutationResult = Apollo.MutationResult<UpdateFiscalEntityMutation>;
export type UpdateFiscalEntityMutationOptions = Apollo.BaseMutationOptions<
  UpdateFiscalEntityMutation,
  UpdateFiscalEntityMutationVariables
>;
export const DeleteFiscalEntityDocument = gql`
  mutation DeleteFiscalEntity($id: ID!) {
    deleteFiscalEntity(id: $id)
  }
`;
export type DeleteFiscalEntityMutationFn = Apollo.MutationFunction<
  DeleteFiscalEntityMutation,
  DeleteFiscalEntityMutationVariables
>;

/**
 * __useDeleteFiscalEntityMutation__
 *
 * To run a mutation, you first call `useDeleteFiscalEntityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFiscalEntityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFiscalEntityMutation, { data, loading, error }] = useDeleteFiscalEntityMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteFiscalEntityMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteFiscalEntityMutation,
    DeleteFiscalEntityMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteFiscalEntityMutation, DeleteFiscalEntityMutationVariables>(
    DeleteFiscalEntityDocument,
    options
  );
}
export type DeleteFiscalEntityMutationHookResult = ReturnType<typeof useDeleteFiscalEntityMutation>;
export type DeleteFiscalEntityMutationResult = Apollo.MutationResult<DeleteFiscalEntityMutation>;
export type DeleteFiscalEntityMutationOptions = Apollo.BaseMutationOptions<
  DeleteFiscalEntityMutation,
  DeleteFiscalEntityMutationVariables
>;
export const GetLedgerDocument = gql`
  query GetLedger($entityId: ID!, $pagination: PaginationInput, $taxYear: String) {
    financialEntries(entityId: $entityId, pagination: $pagination, taxYear: $taxYear) {
      items {
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
      total
      skip
      take
      hasMore
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
 *      pagination: // value for 'pagination'
 *      taxYear: // value for 'taxYear'
 *   },
 * });
 */
export function useGetLedgerQuery(
  baseOptions: Apollo.QueryHookOptions<GetLedgerQuery, GetLedgerQueryVariables> &
    ({ variables: GetLedgerQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetLedgerQuery, GetLedgerQueryVariables>(GetLedgerDocument, options);
}
export function useGetLedgerLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetLedgerQuery, GetLedgerQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetLedgerQuery, GetLedgerQueryVariables>(GetLedgerDocument, options);
}
// @ts-ignore
export function useGetLedgerSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GetLedgerQuery, GetLedgerQueryVariables>
): Apollo.UseSuspenseQueryResult<GetLedgerQuery, GetLedgerQueryVariables>;
export function useGetLedgerSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetLedgerQuery, GetLedgerQueryVariables>
): Apollo.UseSuspenseQueryResult<GetLedgerQuery | undefined, GetLedgerQueryVariables>;
export function useGetLedgerSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetLedgerQuery, GetLedgerQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetLedgerQuery, GetLedgerQueryVariables>(
    GetLedgerDocument,
    options
  );
}
export type GetLedgerQueryHookResult = ReturnType<typeof useGetLedgerQuery>;
export type GetLedgerLazyQueryHookResult = ReturnType<typeof useGetLedgerLazyQuery>;
export type GetLedgerSuspenseQueryHookResult = ReturnType<typeof useGetLedgerSuspenseQuery>;
export type GetLedgerQueryResult = Apollo.QueryResult<GetLedgerQuery, GetLedgerQueryVariables>;
export const GetFinancialEntryDocument = gql`
  query GetFinancialEntry($id: ID!) {
    financialEntry(id: $id) {
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
 * __useGetFinancialEntryQuery__
 *
 * To run a query within a React component, call `useGetFinancialEntryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFinancialEntryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFinancialEntryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetFinancialEntryQuery(
  baseOptions: Apollo.QueryHookOptions<GetFinancialEntryQuery, GetFinancialEntryQueryVariables> &
    ({ variables: GetFinancialEntryQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetFinancialEntryQuery, GetFinancialEntryQueryVariables>(
    GetFinancialEntryDocument,
    options
  );
}
export function useGetFinancialEntryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetFinancialEntryQuery, GetFinancialEntryQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetFinancialEntryQuery, GetFinancialEntryQueryVariables>(
    GetFinancialEntryDocument,
    options
  );
}
// @ts-ignore
export function useGetFinancialEntrySuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetFinancialEntryQuery,
    GetFinancialEntryQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetFinancialEntryQuery, GetFinancialEntryQueryVariables>;
export function useGetFinancialEntrySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetFinancialEntryQuery, GetFinancialEntryQueryVariables>
): Apollo.UseSuspenseQueryResult<
  GetFinancialEntryQuery | undefined,
  GetFinancialEntryQueryVariables
>;
export function useGetFinancialEntrySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetFinancialEntryQuery, GetFinancialEntryQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetFinancialEntryQuery, GetFinancialEntryQueryVariables>(
    GetFinancialEntryDocument,
    options
  );
}
export type GetFinancialEntryQueryHookResult = ReturnType<typeof useGetFinancialEntryQuery>;
export type GetFinancialEntryLazyQueryHookResult = ReturnType<typeof useGetFinancialEntryLazyQuery>;
export type GetFinancialEntrySuspenseQueryHookResult = ReturnType<
  typeof useGetFinancialEntrySuspenseQuery
>;
export type GetFinancialEntryQueryResult = Apollo.QueryResult<
  GetFinancialEntryQuery,
  GetFinancialEntryQueryVariables
>;
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
export type AddFinancialEntryMutationFn = Apollo.MutationFunction<
  AddFinancialEntryMutation,
  AddFinancialEntryMutationVariables
>;

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
export function useAddFinancialEntryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddFinancialEntryMutation,
    AddFinancialEntryMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<AddFinancialEntryMutation, AddFinancialEntryMutationVariables>(
    AddFinancialEntryDocument,
    options
  );
}
export type AddFinancialEntryMutationHookResult = ReturnType<typeof useAddFinancialEntryMutation>;
export type AddFinancialEntryMutationResult = Apollo.MutationResult<AddFinancialEntryMutation>;
export type AddFinancialEntryMutationOptions = Apollo.BaseMutationOptions<
  AddFinancialEntryMutation,
  AddFinancialEntryMutationVariables
>;
export const ExtractFinancialEntryDocument = gql`
  mutation ExtractFinancialEntry($input: ExtractFinancialEntryInput!) {
    extractFinancialEntry(input: $input) {
      date
      amount
      currency
      category
      description
      taxYear
      type
    }
  }
`;
export type ExtractFinancialEntryMutationFn = Apollo.MutationFunction<
  ExtractFinancialEntryMutation,
  ExtractFinancialEntryMutationVariables
>;

/**
 * __useExtractFinancialEntryMutation__
 *
 * To run a mutation, you first call `useExtractFinancialEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExtractFinancialEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [extractFinancialEntryMutation, { data, loading, error }] = useExtractFinancialEntryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useExtractFinancialEntryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ExtractFinancialEntryMutation,
    ExtractFinancialEntryMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ExtractFinancialEntryMutation, ExtractFinancialEntryMutationVariables>(
    ExtractFinancialEntryDocument,
    options
  );
}
export type ExtractFinancialEntryMutationHookResult = ReturnType<
  typeof useExtractFinancialEntryMutation
>;
export type ExtractFinancialEntryMutationResult =
  Apollo.MutationResult<ExtractFinancialEntryMutation>;
export type ExtractFinancialEntryMutationOptions = Apollo.BaseMutationOptions<
  ExtractFinancialEntryMutation,
  ExtractFinancialEntryMutationVariables
>;
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
      creditsApplied
      totalTaxLiability
      effectiveTaxRate
      incomeTotal
      deductionsTotal
      creditsTotal
      taxPaidTotal
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
export function useGetTaxProjectionQuery(
  baseOptions: Apollo.QueryHookOptions<GetTaxProjectionQuery, GetTaxProjectionQueryVariables> &
    ({ variables: GetTaxProjectionQueryVariables; skip?: boolean } | { skip: boolean })
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetTaxProjectionQuery, GetTaxProjectionQueryVariables>(
    GetTaxProjectionDocument,
    options
  );
}
export function useGetTaxProjectionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetTaxProjectionQuery, GetTaxProjectionQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetTaxProjectionQuery, GetTaxProjectionQueryVariables>(
    GetTaxProjectionDocument,
    options
  );
}
// @ts-ignore
export function useGetTaxProjectionSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    GetTaxProjectionQuery,
    GetTaxProjectionQueryVariables
  >
): Apollo.UseSuspenseQueryResult<GetTaxProjectionQuery, GetTaxProjectionQueryVariables>;
export function useGetTaxProjectionSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetTaxProjectionQuery, GetTaxProjectionQueryVariables>
): Apollo.UseSuspenseQueryResult<GetTaxProjectionQuery | undefined, GetTaxProjectionQueryVariables>;
export function useGetTaxProjectionSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetTaxProjectionQuery, GetTaxProjectionQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetTaxProjectionQuery, GetTaxProjectionQueryVariables>(
    GetTaxProjectionDocument,
    options
  );
}
export type GetTaxProjectionQueryHookResult = ReturnType<typeof useGetTaxProjectionQuery>;
export type GetTaxProjectionLazyQueryHookResult = ReturnType<typeof useGetTaxProjectionLazyQuery>;
export type GetTaxProjectionSuspenseQueryHookResult = ReturnType<
  typeof useGetTaxProjectionSuspenseQuery
>;
export type GetTaxProjectionQueryResult = Apollo.QueryResult<
  GetTaxProjectionQuery,
  GetTaxProjectionQueryVariables
>;
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
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
}
// @ts-ignore
export function useMeSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>
): Apollo.UseSuspenseQueryResult<MeQuery, MeQueryVariables>;
export function useMeSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>
): Apollo.UseSuspenseQueryResult<MeQuery | undefined, MeQueryVariables>;
export function useMeSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
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
export type SyncUserMutationFn = Apollo.MutationFunction<
  SyncUserMutation,
  SyncUserMutationVariables
>;

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
export function useSyncUserMutation(
  baseOptions?: Apollo.MutationHookOptions<SyncUserMutation, SyncUserMutationVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<SyncUserMutation, SyncUserMutationVariables>(SyncUserDocument, options);
}
export type SyncUserMutationHookResult = ReturnType<typeof useSyncUserMutation>;
export type SyncUserMutationResult = Apollo.MutationResult<SyncUserMutation>;
export type SyncUserMutationOptions = Apollo.BaseMutationOptions<
  SyncUserMutation,
  SyncUserMutationVariables
>;
