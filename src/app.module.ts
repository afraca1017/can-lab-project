import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpamCheckerModule } from './spam-checker/spam-checker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SpamCheckerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
