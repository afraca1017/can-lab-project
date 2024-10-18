import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { SpamCheckerService } from '../src/spam-checker/spam-checker.service';

describe('SpamCheckerService', () => {
  let spamCheckerService: SpamCheckerService;
  let httpService: HttpService;

  beforeEach(async () => {
    // 모듈 생성
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpamCheckerService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(), // HttpService의 get 메서드를 Mocking
          },
        },
      ],
    }).compile();

    spamCheckerService = module.get<SpamCheckerService>(SpamCheckerService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should detect spam correctly', async () => {
    const content = 'spam spam https://moiming.page.link/exam?_imcp=1';

    // Mocking HTTP 응답
    jest
      .spyOn(httpService, 'get')
      .mockReturnValueOnce(of({ data: '<html></html>' }));

    expect(
      await spamCheckerService.isSpam(content, ['docs.github.com'], 1),
    ).toBe(false);
    expect(
      await spamCheckerService.isSpam(content, ['moiming.page.link'], 1),
    ).toBe(true);
    expect(await spamCheckerService.isSpam(content, ['github.com'], 2)).toBe(
      true,
    );
    expect(
      await spamCheckerService.isSpam(content, ['docs.github.com'], 2),
    ).toBe(false);
    expect(
      await spamCheckerService.isSpam(content, ['docs.github.com'], 3),
    ).toBe(true);
  });
});
