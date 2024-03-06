import { UniqueEntityID } from '../../core/entities/unique-entity-id'
import faker from 'faker-br'
import {
  ClientType,
  Common,
  CommonUserProps,
} from '../../domain/enterprise/entities/common'

export function makeClient(
  override: Partial<CommonUserProps> = {},
  id?: UniqueEntityID,
) {
  const client = Common.create(
    {
      name: faker.name.firstName(),
      document: faker.br.cpf(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      type: ClientType.INDIVIDUAL,
      ...override,
    },
    id,
  )

  return client
}
