import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnauthorizedTransactionError } from '@/domain/wallet/application/errors/unauthorized-transaction'
import { InsufficientBalanceError } from '@/domain/wallet/application/errors/insufficient-balance'
import { ReverseTransferUseCase } from '@/domain/wallet/application/use-cases/reverse-transfer'

const reverseTransferBodySchema = z.object({
  id: z.string(),
})

type ReverseTransferBodySchema = z.infer<typeof reverseTransferBodySchema>

@Controller({
  path: '/transfers',
})
export class ReverseTransferController {
  constructor(private transfer: ReverseTransferUseCase) {}

  @Post('reverse')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(reverseTransferBodySchema))
  async handle(@Body() body: ReverseTransferBodySchema) {
    const { id } = body

    const result = await this.transfer.execute({
      id,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case InsufficientBalanceError || UnauthorizedTransactionError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
