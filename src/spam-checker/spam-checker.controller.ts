import { Controller, Post, Body } from '@nestjs/common';
import { SpamCheckerService } from './spam-checker.service';

@Controller('spam-checker')
export class SpamCheckerController {
  constructor(private readonly spamCheckerService: SpamCheckerService) {}

  @Post()
  async checkSpam(@Body('content') content: string): Promise<boolean> {
    const spamDomains = ['www.naver.com', 'www.daum.net', 'www.google.com'];
    const redirectionDepth = 3;
    return this.spamCheckerService.isSpam(
      content,
      spamDomains,
      redirectionDepth,
    );
  }
}
