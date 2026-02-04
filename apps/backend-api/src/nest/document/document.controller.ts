import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { Document, RetentionPolicy } from './models/document.model';
import { AuthGuard } from '../auth/guards/auth.guard';
import { type Request } from 'express';

@Controller('api/documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile()
    file: Express.Multer.File,
    @Req()
    req: Request<{
      body: { entityId: string; retentionPolicy?: RetentionPolicy };
    }>,
  ): Promise<Document> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const userId = req.user!.id;
    const { entityId, retentionPolicy } = req.body;

    if (!entityId) {
      throw new BadRequestException('entityId is required');
    }

    // Upload document to GCS
    const document = await this.documentService.handleUpload({
      userId,
      entityId,
      retentionPolicy: retentionPolicy ?? RetentionPolicy.ephemeral, // Temporary for extraction
      fileBuffer: file.buffer,
      fileName: file.originalname,
      fileMetadata: {
        mimeType: file.mimetype,
        sizeInKb: file.size / 1024,
      },
    });

    return {
      ...document,
      // Do not expose sensitive fields
      wrappedDek: undefined,
      extractedData: undefined,
    };
  }
}
