import { Module } from '@nestjs/common'
import { RegisterClientController } from './controllers/register-client.controller'
import { DatabaseModule } from '../database/databse.module'
import { CryptoModule } from '../cryptography/crypto.module'
import { RegisterClientUseCase } from '@/domain/wallet/application/use-cases/register-client'

@Module({
  imports: [DatabaseModule, CryptoModule],
  controllers: [RegisterClientController],
  providers: [RegisterClientUseCase],
})
export class HttpModule {}
