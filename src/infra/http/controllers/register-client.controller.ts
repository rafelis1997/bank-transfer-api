import { RegisterClientUseCase } from '@/domain/wallet/application/use-cases/register-client'
import { ClientType } from '@/domain/wallet/enterprise/entities/common'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ClientAlreadyExistsError } from '@/domain/wallet/application/errors/client-already-exists-error'

const registerClientBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  document: z.string(),
  password: z.string(),
  type: z.nativeEnum(ClientType).optional().default(ClientType.INDIVIDUAL),
})

type RegisterClientBodySchema = z.infer<typeof registerClientBodySchema>

@Controller({
  path: '/clients',
})
export class RegisterClientController {
  constructor(private registerClient: RegisterClientUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerClientBodySchema))
  async handle(@Body() body: RegisterClientBodySchema) {
    const { email, name, password, type, document } = body

    const result = await this.registerClient.execute({
      document,
      email,
      name,
      password,
      type,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ClientAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
