import { SortableEntityID } from '@/core/entities/sortable-entity-id'
import { Entity } from '../../../core/entities/entity'

export interface TransferProps {
  senderId: string
  receiverId: string
  amount: number
  description?: string | null
  createdAt?: Date
  updatedAt?: Date | null
}

export class Transfer extends Entity<TransferProps> {
  get senderId() {
    return this.props.senderId
  }

  get receiverId() {
    return this.props.receiverId
  }

  get amount() {
    return this.props.amount
  }

  get description() {
    return this.props.description
  }

  set description(description: string | undefined | null) {
    this.props.description = description
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

  static create(props: TransferProps, id?: SortableEntityID) {
    const transfer = new Transfer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id ?? new SortableEntityID(),
    )

    return transfer
  }
}
