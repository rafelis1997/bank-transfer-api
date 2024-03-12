import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Transfer } from '@/domain/wallet/enterprise/entities/transfer'
import { Prisma, Transfer as PrismaTransfer } from '@prisma/client'

export class PrismaTransferMapper {
  static toDomain(raw: PrismaTransfer): Transfer {
    return Transfer.create(
      {
        amount: raw.amount,
        receiverId: raw.receiverId,
        senderId: raw.senderId,
        description: raw.description,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(transfer: Transfer): Prisma.TransferUncheckedCreateInput {
    return {
      id: transfer.id.toString(),
      amount: transfer.amount,
      receiverId: transfer.receiverId,
      senderId: transfer.senderId,
      description: transfer.description,
      createdAt: transfer.createdAt,
      updatedAt: transfer.updatedAt,
    }
  }
}
