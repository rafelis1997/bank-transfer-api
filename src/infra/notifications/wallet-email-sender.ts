import { Retry } from '@/core/strategies/retry'
import { SendEmailUseCase } from '@/domain/notification/application/use-cases/send-email'
import { Injectable } from '@nestjs/common'
import axios from 'axios'

@Injectable()
export class WalletEmailSender implements SendEmailUseCase {
  async send(email: string): Promise<boolean> {
    const response = await new Retry().init({
      requestCallBack: () => {
        return axios.get(
          'https://run.mocky.io/v3/54dc2cf1-3add-45b5-b5a9-6bf7e7f1f4a6',
        )
      },
    })

    if (response.isLeft()) {
      console.log(
        `Não foi possivel enviar email para ${email}, ${response.value.message}`,
      )
      return false
    }

    return true
  }
}
