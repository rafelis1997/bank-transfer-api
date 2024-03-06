import { Transfer } from '@/domain/enterprise/entities/transfer'

export abstract class TransactionValidator {
  abstract validate(transfer: Transfer): Promise<boolean>
}
