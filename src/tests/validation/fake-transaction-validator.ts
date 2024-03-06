import { TransactionValidator } from '@/domain/application/validation/transaction-validator'
import { Transfer } from '@/domain/enterprise/entities/transfer'

export class FakeTransactionValidator extends TransactionValidator {
  public isValid: boolean = true
  async validate(transfer: Transfer): Promise<boolean> {
    console.log(`validating transaction ${transfer.id.toString()}`)
    return this.isValid
  }
}
