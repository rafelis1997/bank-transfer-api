import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ClientType, Common } from '@/domain/wallet/enterprise/entities/common'
import { Client as PrismaClient, Prisma } from '@prisma/client'

export class PrismaClientMapper {
  static toDomain(raw: PrismaClient): Common {
    return Common.create(
      {
        name: raw.name,
        email: raw.email,
        document: raw.document,
        password: raw.password,
        type: ClientType[raw.type],
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(client: Common): Prisma.ClientUncheckedCreateInput {
    return {
      id: client.id.toString(),
      name: client.name,
      email: client.email,
      document: client.document,
      password: client.password,
      type: client.type,
    }
  }
}
