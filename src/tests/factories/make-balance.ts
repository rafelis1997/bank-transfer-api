import { Balance, BalanceProps } from '@/domain/enterprise/entities/balance'
import { UniqueEntityID } from '../../core/entities/unique-entity-id'

export function makeBalance(
  override: Partial<BalanceProps> = {},
  id?: UniqueEntityID,
) {
  const balance = Balance.create(
    {
      amount: 20000,
      createdAt: new Date(),
      holderId: new UniqueEntityID(),
      lastTransaction: null,
      ...override,
    },
    id,
  )

  return balance
}
