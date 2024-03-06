import { Optional } from '@/core/types/optional'
import { Entity } from '../../../core/entities/entity'
import { UniqueEntityID } from '../../../core/entities/unique-entity-id'

export interface BalanceProps {
  holderId: UniqueEntityID
  amount: number
  lastTransaction: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Balance extends Entity<BalanceProps> {
  get holderId() {
    return this.props.holderId
  }

  get amount() {
    return this.props.amount
  }

  set amount(value: number) {
    this.props.amount = value
  }

  get lastTransaction() {
    return this.props.lastTransaction
  }

  set lastTransaction(value: string | null) {
    this.props.lastTransaction = value
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<BalanceProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const balance = new Balance(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: new Date(),
      },
      id,
    )

    return balance
  }
}
