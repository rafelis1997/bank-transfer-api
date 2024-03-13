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
import { CreateTransferUseCase } from '@/domain/wallet/application/use-cases/create-transfer'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnauthorizedTransactionError } from '@/domain/wallet/application/errors/unauthorized-transaction'
import { InsufficientBalanceError } from '@/domain/wallet/application/errors/insufficient-balance'

const createTransferBodySchema = z.object({
  senderId: z.string(),
  recipientId: z.string(),
  amount: z.number(),
  description: z.string().optional(),
})

type CreateTransferBodySchema = z.infer<typeof createTransferBodySchema>

@Controller({
  path: '/transfers',
})
export class CreateTransferController {
  constructor(private transfer: CreateTransferUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createTransferBodySchema))
  async handle(@Body() body: CreateTransferBodySchema) {
    const { amount, recipientId, senderId, description } = body

    const result = await this.transfer.execute({
      amount,
      receiverId: recipientId,
      senderId,
      description,
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
