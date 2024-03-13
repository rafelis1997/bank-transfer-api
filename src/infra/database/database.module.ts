import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { ClientRepository } from '@/domain/wallet/application/repositories/clients-repository'
import { PrismaClientsRepository } from './repositories/prisma-clients-repository'
import { BalanceRepository } from '@/domain/wallet/application/repositories/balance-repository'
import { PrismaBalanceRepository } from './repositories/prisma-balance-repository'
import { PrismaTransferRepository } from './repositories/prisma-transfer-repository'
import { TransferRepository } from '@/domain/wallet/application/repositories/transfer-repository'
import { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository'
import { PrismaNotificationRepository } from './repositories/prisma-notification-repository'

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
    {
      provide: TransferRepository,
      useClass: PrismaTransferRepository,
    },
    {
      provide: NotificationRepository,
      useClass: PrismaNotificationRepository,
    },
  ],
  exports: [
    PrismaService,
    ClientRepository,
    BalanceRepository,
    TransferRepository,
    NotificationRepository,
  ],
})
export class DatabaseModule {}
