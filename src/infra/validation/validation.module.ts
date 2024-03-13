import { Module } from '@nestjs/common'
import { WalletTransferValidator } from './wallet-transfer-validator'
import { TransactionValidator } from '@/domain/wallet/application/validation/transaction-validator'

@Module({
  providers: [
    {
      provide: TransactionValidator,
      useClass: WalletTransferValidator,
    },
  ],
  exports: [TransactionValidator],
})
export class ValidationModule {}
