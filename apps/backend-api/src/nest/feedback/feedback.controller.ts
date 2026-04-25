import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { type Request } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FeedbackService } from './feedback.service';

interface SubmitFeedbackBody {
  rating: number;
  category: 'bug' | 'feature_request' | 'general';
  comment: string;
}

@Controller('api/feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  async submit(
    @Body() body: SubmitFeedbackBody,
    @Req() req: Request,
  ): Promise<{ id: string }> {
    const { rating, category, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      throw new BadRequestException('rating must be between 1 and 5');
    }
    if (!['bug', 'feature_request', 'general'].includes(category)) {
      throw new BadRequestException('Invalid category');
    }
    if (!comment?.trim()) {
      throw new BadRequestException('comment is required');
    }

    return this.feedbackService.create({
      userId: req.user!.id,
      rating,
      category,
      comment: comment.trim(),
    });
  }
}
