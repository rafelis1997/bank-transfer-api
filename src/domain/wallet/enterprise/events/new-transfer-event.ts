import { DomainEvent } from '@/core/events/domain-event'
import { Transfer } from '../entities/transfer'
import { SortableEntityID } from '@/core/entities/sortable-entity-id'

export class NewTransferEvent implements DomainEvent {
  public ocurredAt: Date
  public transfer: Transfer

  constructor(transfer: Transfer) {
    this.ocurredAt = new Date()
    this.transfer = transfer
  }

  getAggregateId(): SortableEntityID {
    return this.transfer.id
  }
}
