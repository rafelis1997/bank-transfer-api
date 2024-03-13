import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { OnTransferCreated } from '@/domain/notification/application/subscribers/on-transfer-created'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnTransferCreated,
    SendNotificationUseCase,
    ReadNotificationUseCase,
  ],
})
export class EventsModule {}
