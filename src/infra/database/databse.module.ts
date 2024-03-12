import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { ClientRepository } from '@/domain/wallet/application/repositories/clients-repository'
import { PrismaClientsRepository } from './repositories/prisma-clients-repository'
import { BalanceRepository } from '@/domain/wallet/application/repositories/balance-repository'
import { PrismaBalanceRepository } from './repositories/prisma-balance-repository'

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: ClientRepository,
      useClass: PrismaClientsRepository,
    },
    {
      provide: BalanceRepository,
      useClass: PrismaBalanceRepository,
    },
  ],
  exports: [PrismaService, ClientRepository, BalanceRepository],
})
export class DatabaseModule {}
