import { BalanceRepository } from '@/domain/wallet/application/repositories/balance-repository'
import { Balance } from '@/domain/wallet/enterprise/entities/balance'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { PrismaBalanceMapper } from '../mappers/prisma-balance-mapper'

@Injectable()
export class PrismaBalanceRepository implements BalanceRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findByHolderId(holderId: string): Promise<Balance | null> {
    const balance = await this.prisma.balance.findUnique({
      where: {
        holderId,
      },
    })

    if (!balance) {
      return null
    }

    return PrismaBalanceMapper.toDomain(balance)
  }

  async save(balances: Balance[]): Promise<void> {
    const data = balances.map((balance) =>
      PrismaBalanceMapper.toPrisma(balance),
    )

    await this.prisma.balance.updateMany({ data })
  }

  async create(balance: Balance): Promise<void> {
    const data = PrismaBalanceMapper.toPrisma(balance)

    await this.prisma.balance.create({
      data,
    })
  }
}
