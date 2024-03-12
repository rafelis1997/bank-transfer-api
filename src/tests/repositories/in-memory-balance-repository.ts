import { BalanceRepository } from '@/domain/wallet/application/repositories/balance-repository'
import { Balance } from '@/domain/wallet/enterprise/entities/balance'

export class InMemoryBalanceRepository implements BalanceRepository {
  public items: Balance[] = []

  async findByHolderId(holderId: string) {
    const balance = this.items.find(
      (item) => item.holderId.toString() === holderId,
    )

    if (!balance) {
      return null
    }

    return balance
  }

  async save(balances: Balance[]) {
    for (const balance of balances) {
      const findBalance = this.items.findIndex((item) => item.id === balance.id)

      if (findBalance < 0) return

      this.items[findBalance] = balance
    }
  }

  async create(balance: Balance) {
    this.items.push(balance)
  }
}
