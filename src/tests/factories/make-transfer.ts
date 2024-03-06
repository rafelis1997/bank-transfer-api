import { SortableEntityID } from '@/core/entities/sortable-entity-id'
import { UniqueEntityID } from '../../core/entities/unique-entity-id'
import { Transfer, TransferProps } from '@/domain/enterprise/entities/transfer'

export function makeTransfer(
  override: Partial<TransferProps> = {},
  id?: SortableEntityID,
) {
  const client = Transfer.create(
    {
      amount: 1000,
      receiverId: new UniqueEntityID().toString(),
      senderId: new UniqueEntityID().toString(),
      ...override,
    },
    id,
  )

  return client
}
