import { randomUUID } from 'node:crypto'

export class UniqueEntityID {
  private value: string

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  createValue(value?: string) {
    return value ?? randomUUID()
  }

  constructor(value?: string) {
    this.value = this.createValue(value)
  }
}
