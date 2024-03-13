import { Module } from '@nestjs/common'
import { RegisterClientController } from './controllers/register-client.controller'
import { DatabaseModule } from '../database/database.module'
import { CryptoModule } from '../cryptography/crypto.module'
import { RegisterClientUseCase } from '@/domain/wallet/application/use-cases/register-client'
import { CreateTransferController } from './controllers/create-transfer.controller'
import { CreateTransferUseCase } from '@/domain/wallet/application/use-cases/create-transfer'
import { ValidationModule } from '../validation/validation.module'
import { ReverseTransferUseCase } from '@/domain/wallet/application/use-cases/reverse-transfer'
import { ReverseTransferController } from './controllers/reverse-transfer.controller'

@Module({
  imports: [DatabaseModule, CryptoModule, ValidationModule],
  controllers: [
    RegisterClientController,
    CreateTransferController,
    ReverseTransferController,
  ],
  providers: [
    RegisterClientUseCase,
    CreateTransferUseCase,
    ReverseTransferUseCase,
  ],
})
export class HttpModule {}
