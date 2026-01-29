import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

export class CipherUtil {
  private static readonly ALGORITHM = 'aes-256-gcm';
  static readonly ENCODING = 'base64';

  static encrypt(data: Buffer | string, dek: Buffer): string {
    const iv = randomBytes(12); // GCM standard IV size
    const cipher = createCipheriv(this.ALGORITHM, dek, iv);

    const input = typeof data === 'string' ? Buffer.from(data, 'utf8') : data;
    const encrypted = Buffer.concat([cipher.update(input), cipher.final()]);
    const authTag = cipher.getAuthTag();

    // Package as IV + AuthTag + EncryptedData for storage
    return Buffer.concat([iv, authTag, encrypted]).toString(this.ENCODING);
  }

  static decrypt(encryptedData: string, dek: Buffer): Buffer {
    const buffer = Buffer.from(encryptedData, this.ENCODING);
    const iv = buffer.subarray(0, 12);
    const authTag = buffer.subarray(12, 28);
    const ciphertext = buffer.subarray(28);

    const decipher = createDecipheriv(this.ALGORITHM, dek, iv);
    decipher.setAuthTag(authTag);

    return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  }

  static generateDek(): Buffer {
    return randomBytes(32); // AES-256 requires a 32-byte key
  }
}
