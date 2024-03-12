import { ClientRepository } from '@/domain/wallet/application/repositories/clients-repository'
import { Common } from '@/domain/wallet/enterprise/entities/common'

export class InMemoryClientRepository implements ClientRepository {
  public items: Common[] = []

  async findById(id: string): Promise<Common | null> {
    const client = this.items.find((item) => item.id.toString() === id)

    if (!client) {
      return null
    }

    return client
  }

  async findByEmail(email: string) {
    const client = this.items.find((item) => item.email === email)

    if (!client) {
      return null
    }

    return client
  }

  async findByDocument(document: string) {
    const client = this.items.find((item) => item.document === document)

    if (!client) {
      return null
    }

    return client
  }

  async create(client: Common) {
    this.items.push(client)
  }
}
