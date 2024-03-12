import { Common } from '../../enterprise/entities/common'

export abstract class ClientRepository {
  abstract findById(id: string): Promise<Common | null>
  abstract findByEmail(email: string): Promise<Common | null>
  abstract findByDocument(document: string): Promise<Common | null>
  abstract create(client: Common): Promise<void>
}
