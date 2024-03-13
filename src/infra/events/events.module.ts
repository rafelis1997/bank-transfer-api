import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { OnTransferCreated } from '@/domain/notification/application/subscribers/on-transfer-created'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { NotificationsModule } from '../notifications/notification.module'
import { WalletEmailSender } from '../notifications/wallet-email-sender'

@Module({
  imports: [DatabaseModule, NotificationsModule],
  providers: [
    OnTransferCreated,
    WalletEmailSender,
    SendNotificationUseCase,
    ReadNotificationUseCase,
  ],
})
export class EventsModule {}
