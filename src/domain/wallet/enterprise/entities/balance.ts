import { Optional } from '@/core/types/optional'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'
import { AggregateRoot } from '@/core/entities/aggregate-root'

export interface BalanceProps {
  holderId: UniqueEntityID
  amount: number
  lastTransaction: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Balance extends AggregateRoot<BalanceProps> {
  get holderId() {
    return this.props.holderId
  }

  get amount() {
    return this.props.amount
  }

  set amount(value: number) {
    this.props.amount = value
    this.touch()
  }

  get lastTransaction() {
    return this.props.lastTransaction
  }

  set lastTransaction(value: string | null) {
    this.props.lastTransaction = value
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
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
