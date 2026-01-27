import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodTypeDef } from 'zod';

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private schema: ZodSchema<T, ZodTypeDef, unknown>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      // Flatten Zod errors into a readable format for the frontend
      const message = result.error.errors
        .map((error) => `${error.path.join('.')}: ${error.message}`)
        .join(', ');

      throw new BadRequestException(`Validation failed: ${message}`);
    }

    return result.data;
  }
}
