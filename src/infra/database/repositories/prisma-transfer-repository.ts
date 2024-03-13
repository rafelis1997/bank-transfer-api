import { TransferRepository } from '@/domain/wallet/application/repositories/transfer-repository'
import { Transfer } from '@/domain/wallet/enterprise/entities/transfer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaTransferMapper } from '../mappers/prisma-transfer-mapper'
import { DomainEvents } from '@/core/events/domain-events'

@Injectable()
export class PrismaTransferRepository implements TransferRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: string): Promise<Transfer | null> {
    const transfer = await this.prisma.transfer.findUnique({
      where: { id },
    })

    if (!transfer) {
      return null
    }

    return PrismaTransferMapper.toDomain(transfer)
  }

  async fetchAllFromClient(clientId: string): Promise<Transfer[]> {
    const transfers = await this.prisma.transfer.findMany({
      where: {
        OR: [
          {
            receiverId: clientId,
          },
          {
            senderId: clientId,
          },
        ],
      },
    })

    return transfers.map((transfer) => PrismaTransferMapper.toDomain(transfer))
  }

  async create(transfer: Transfer): Promise<void> {
    const data = PrismaTransferMapper.toPrisma(transfer)

    await this.prisma.transfer.create({ data })

    DomainEvents.dispatchEventsForAggregate(transfer.id)
  }
}
