import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Balance } from '@/domain/wallet/enterprise/entities/balance'
import { Prisma, Balance as PrismaBalance } from '@prisma/client'

export class PrismaBalanceMapper {
  static toDomain(raw: PrismaBalance): Balance {
    return Balance.create(
      {
        holderId: new UniqueEntityID(raw.holderId),
        amount: raw.amount,
        lastTransaction: raw.transferId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(balance: Balance): Prisma.BalanceUncheckedCreateInput {
    return {
      id: balance.id.toString(),
      amount: balance.amount,
      holderId: balance.holderId.toString(),
      transferId: balance.lastTransaction ?? undefined,
      createdAt: balance.createdAt,
      updatedAt: balance.updatedAt,
    }
  }
}
