import { SendEmailUseCase } from '@/domain/notification/application/use-cases/send-email'
import { Module } from '@nestjs/common'
import { WalletEmailSender } from './wallet-email-sender'

@Module({
  providers: [
    {
      provide: SendEmailUseCase,
      useClass: WalletEmailSender,
    },
  ],
  exports: [SendEmailUseCase],
})
export class NotificationsModule {}
