import { KeyManagementServiceClient } from '@google-cloud/kms';

export class KmsService {
  private client = new KeyManagementServiceClient();

  constructor(
    private readonly projectId: string,
    private readonly locationId: string,
    private readonly keyRingId: string,
    private readonly keyId: string
  ) {}

  private get keyName() {
    return this.client.cryptoKeyPath(this.projectId, this.locationId, this.keyRingId, this.keyId);
  }

  async wrapKey(plaintextKey: Buffer): Promise<string> {
    console.log(`[KmsService] Wrapping new DEK via GCP KMS...`);
    const [result] = await this.client.encrypt({
      name: this.keyName,
      plaintext: plaintextKey,
    });
    return Buffer.from(result.ciphertext as Uint8Array).toString('base64');
  }

  async unwrapKey(wrappedKey: string): Promise<Buffer> {
    console.log(`[KmsService] Unwrapping DEK via GCP KMS...`);
    const [result] = await this.client.decrypt({
      name: this.keyName,
      ciphertext: Buffer.from(wrappedKey, 'base64'),
    });
    return Buffer.from(result.plaintext as Uint8Array);
  }
}
