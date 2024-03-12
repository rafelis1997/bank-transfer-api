import { Module } from '@nestjs/common'
import { envSchema } from './env/env'
import { ConfigModule } from '@nestjs/config'
import { EnvModule } from './env/env.module'
import { EnvService } from './env/env.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
  ],
  providers: [EnvService],
})
export class AppModule {}
