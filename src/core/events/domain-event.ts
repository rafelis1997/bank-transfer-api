import { SortableEntityID } from '../entities/sortable-entity-id'
import { UniqueEntityID } from '../entities/unique-entity-id'

export interface DomainEvent {
  ocurredAt: Date
  getAggregateId(): UniqueEntityID | SortableEntityID
}
