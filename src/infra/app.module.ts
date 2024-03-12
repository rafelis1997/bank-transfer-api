import { Module } from '@nestjs/common'
import { envSchema } from './env/env'
import { ConfigModule } from '@nestjs/config'
import { EnvModule } from './env/env.module'
import { EnvService } from './env/env.service'
import { EventsModule } from './events/events.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    EventsModule,
  ],
  providers: [EnvService],
})
export class AppModule {}
