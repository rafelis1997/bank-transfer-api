import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class SendEmailUseCase {
  abstract send(email: string): Promise<boolean>
}
