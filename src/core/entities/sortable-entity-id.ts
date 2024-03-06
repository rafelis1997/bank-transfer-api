import { ulid } from 'ulid'
import { UniqueEntityID } from './unique-entity-id'

export class SortableEntityID extends UniqueEntityID {
  createValue(value?: string) {
    return value ?? ulid()
  }
}
