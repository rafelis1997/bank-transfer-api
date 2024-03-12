import { Transfer } from '@/domain/wallet/enterprise/entities/transfer'

export abstract class TransactionValidator {
  abstract validate(transfer: Transfer): Promise<boolean>
}
