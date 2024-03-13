import { TransactionValidator } from '@/domain/wallet/application/validation/transaction-validator'
import { Transfer } from '@/domain/wallet/enterprise/entities/transfer'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import axios from 'axios'

enum AUTHORIZATION_STATES {
  AUTHORIZED = 'autorizado',
  UNAUTHORIZED = 'nao autorizado',
}

@Injectable()
export class WalletTransferValidator implements TransactionValidator {
  async validate(transfer: Transfer): Promise<boolean> {
    try {
      const response = await axios.get(
        'https://run.mocky.io/v3/5794d450-d2e2-4412-8131-73d0293ac1cc',
      )

      const { data } = response

      const isValid =
        data.message.toLowerCase() === AUTHORIZATION_STATES.AUTHORIZED

      console.log(transfer)
      return isValid
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}
