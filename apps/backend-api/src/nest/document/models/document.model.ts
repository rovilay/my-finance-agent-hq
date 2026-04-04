import {
  ObjectType,
  Field,
  ID,
  registerEnumType,
  InputType,
  Float,
} from '@nestjs/graphql';
import { Paginated } from '../../common/models';

export enum DocumentStatus {
  uploaded = 'uploaded',
  processed = 'processed',
  verified = 'verified',
  purged = 'purged',
  failed = 'failed',
}

export enum RetentionPolicy {
  permanent = 'permanent',
  verify_and_purge = 'verify_and_purge',
  ephemeral = 'ephemeral',
}

registerEnumType(DocumentStatus, { name: 'DocumentStatus' });
registerEnumType(RetentionPolicy, { name: 'RetentionPolicy' });

@ObjectType()
export class FileMetadata {
  @Field()
  mimeType: string;

  @Field(() => Float)
  sizeInKb: number;
}

@InputType()
export class FileMetadataInput {
  @Field()
  mimeType: string;

  @Field(() => Float)
  sizeInKb: number;
}

@ObjectType()
export class Document {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  entityId: string;

  @Field()
  fileName: string;

  @Field(() => DocumentStatus)
  status: DocumentStatus;

  @Field(() => RetentionPolicy)
  retentionPolicy: RetentionPolicy;

  @Field({ nullable: true })
  storagePath?: string;

  @Field({ nullable: true })
  purgedAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => FileMetadata)
  fileMetadata: FileMetadata;

  @Field({ nullable: true })
  decryptedData?: string;

  @Field({ nullable: true })
  failureReason?: string;

  // internal use only
  wrappedDek?: string | null;
  extractedData?: string | null;
}

@InputType()
export class DocumentInput {
  @Field()
  fileName: string;

  @Field(() => RetentionPolicy)
  retentionPolicy: RetentionPolicy;

  @Field(() => FileMetadataInput)
  fileMetadata: FileMetadataInput;

  @Field()
  userId: string;

  @Field()
  entityId: string;

  fileBuffer: Buffer; // Raw file buffer (not exposed to GraphQL)
}

@ObjectType()
export class PaginatedDocument extends Paginated(Document) {}
