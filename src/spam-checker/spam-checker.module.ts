import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { SpamCheckerService } from './spam-checker.service';
import { SpamCheckerController } from './spam-checker.controller';

@Module({
  imports: [HttpModule],
  controllers: [SpamCheckerController],
  providers: [SpamCheckerService],
})
export class SpamCheckerModule {}
