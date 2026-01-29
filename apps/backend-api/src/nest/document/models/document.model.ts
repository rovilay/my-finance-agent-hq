import {
  ObjectType,
  Field,
  ID,
  registerEnumType,
  InputType,
} from '@nestjs/graphql';

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
export class Document {
  @Field(() => ID)
  id: string;

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

  @Field()
  mimeType: string;

  @Field({ nullable: true })
  decryptedData?: string;

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

  @Field()
  mimeType: string;

  @Field()
  userId: string;

  @Field()
  entityId: string;

  @Field(() => Buffer)
  fileBuffer: Buffer;
}
