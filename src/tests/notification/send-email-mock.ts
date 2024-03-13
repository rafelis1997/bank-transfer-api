import { SendEmailUseCase } from '@/domain/notification/application/use-cases/send-email'

export class SendEmailMock implements SendEmailUseCase {
  public _fails = false

  async send(email: string): Promise<boolean> {
    console.log(email)
    return this._fails
  }
}
