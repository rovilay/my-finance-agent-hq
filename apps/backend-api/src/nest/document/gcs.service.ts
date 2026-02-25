import { Storage } from '@google-cloud/storage';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { type EnvConfig, envConfig } from 'src/config/env';

@Injectable()
export class GcsService {
  private readonly storage: Storage;

  constructor(@Inject(envConfig.KEY) private readonly config: EnvConfig) {
    // Initialize Storage with credentials from environment if provided
    if (process.env.GCP_SERVICE_ACCOUNT_JSON) {
      try {
        const credentials = JSON.parse(process.env.GCP_SERVICE_ACCOUNT_JSON);
        this.storage = new Storage({ credentials });
      } catch (error) {
        console.error('[GcsService] Failed to parse GCP credentials', error);
        throw new Error('Invalid GCP service account credentials');
      }
    } else {
      // Fall back to default credentials (for local development with gcloud auth)
      this.storage = new Storage();
    }
  }

  async upload(path: string, content: Buffer, mimeType: string): Promise<void> {
    console.log(`[GcsService] ☁️ Uploading encrypted blob to: ${path}`);
    try {
      const bucket = this.storage.bucket(this.config.GCS_BUCKET_NAME);
      const file = bucket.file(path);

      await file.save(content, {
        contentType: mimeType,
        metadata: {
          cacheControl: 'private, max-age=0',
        },
      });
    } catch (error) {
      console.error(`[GcsService] ❌ GCS Upload failed`, error);
      throw new InternalServerErrorException('Cloud storage failure');
    }
  }

  async delete(path: string): Promise<void> {
    console.log(`[GcsService] 🗑️ Executing Purge for: ${path}`);
    try {
      await this.storage
        .bucket(this.config.GCS_BUCKET_NAME)
        .file(path)
        .delete();
    } catch (error) {
      // If the file is already gone, we consider it a success for "Purge"
      console.warn(
        `[GcsService] ⚠️ Delete failed or file missing: ${path}`,
        error,
      );
    }
  }

  // Add this to your existing GcsService
  async download(path: string): Promise<Buffer> {
    console.log(`[GcsService] 📥 Downloading encrypted blob: ${path}`);
    try {
      const bucket = this.storage.bucket(this.config.GCS_BUCKET_NAME);
      const [content] = await bucket.file(path).download();
      return content;
    } catch (error) {
      console.error(`[GcsService] ❌ GCS Download failed`, error);
      throw new InternalServerErrorException(
        'Could not retrieve file from cloud storage',
      );
    }
  }

  async downloadFile(path: string): Promise<Buffer> {
    return this.download(path);
  }
}
