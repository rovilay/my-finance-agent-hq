import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AiService } from './ai.service';
import { type Request } from 'express';
// import '../../types/express';

interface ChatRequest {
  message: string;
  entityId: string;
  taxYear?: string;
}

@Controller('api/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('tax-education-chat')
  @UseGuards(AuthGuard)
  async taxEducationChat(
    @Body() body: ChatRequest,
    @Req() req: Request,
  ): Promise<{ response: string }> {
    const userId = req.user!.id;

    const response = await this.aiService.getTaxEducationResponse(
      body.message,
      userId,
      body.entityId,
      body.taxYear,
    );

    return { response };
  }
}
