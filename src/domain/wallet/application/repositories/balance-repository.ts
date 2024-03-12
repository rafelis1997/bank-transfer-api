import { Balance } from '../../enterprise/entities/balance'

export abstract class BalanceRepository {
  abstract findByHolderId(holderId: string): Promise<Balance | null>

  abstract save(balances: Balance[]): Promise<void>
  abstract create(balance: Balance): Promise<void>
}
