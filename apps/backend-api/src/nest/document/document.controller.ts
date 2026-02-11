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
import { ExtractionWorkflow } from '../ai/workflows/extraction.workflow';

@Controller('api/documents')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,
    private readonly extractionWorkflow: ExtractionWorkflow,
  ) {}

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile()
    file: Express.Multer.File,
    @Req()
    req: Request<{
      body: {
        entityId: string;
        retentionPolicy?: RetentionPolicy;
        extractData?: boolean;
      };
    }>,
  ): Promise<Document> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const userId = req.user!.id;
    const { entityId, retentionPolicy, extractData } = req.body;

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
        sizeInKb: parseFloat((file.size / 1024).toFixed(2)),
      },
    });

    if (extractData) {
      await this.extractionWorkflow.initiateExtraction(document.id);
    }

    return {
      ...document,
      // Do not expose sensitive fields
      wrappedDek: undefined,
      extractedData: undefined,
    };
  }
}
