import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import * as cheerio from 'cheerio'; // HTML 파싱을 위한 모듈
import { URL } from 'url';

@Injectable()
export class SpamCheckerService {
  constructor(private readonly httpService: HttpService) {}

  // 스팸 여부를 확인하는 메인 함수
  public async isSpam(
    content: string,
    spamLinkDomains: string[],
    redirectionDepth: number,
  ): Promise<boolean> {
    const urlPattern = /https?:\/\/[^\s]+/g;
    const urls = content.match(urlPattern);
    if (!urls) return false;

    const visitedUrls = new Set<string>();
    const checkSpamPromises = urls.map((url) =>
      this.checkSpam(url, spamLinkDomains, redirectionDepth, visitedUrls),
    );

    const results = await Promise.all(checkSpamPromises);
    return results.some((result) => result === true);
  }

  // 각 URL에 대해 스팸 여부를 체크하는 비동기 함수
  private async checkSpam(
    url: string,
    spamLinkDomains: string[],
    depth: number,
    visitedUrls: Set<string>,
  ): Promise<boolean> {
    if (depth <= 0 || visitedUrls.has(url)) return false;

    visitedUrls.add(url);

    const domain = new URL(url).hostname;

    if (spamLinkDomains.includes(domain)) return true;

    const html = await this.fetchUrl(url);

    if (!html) return false;

    const links = this.extractLinksFromHtml(html);

    const checkSpamPromises = links.map((link) =>
      this.checkSpam(link, spamLinkDomains, depth - 1, visitedUrls),
    );
    const results = await Promise.all(checkSpamPromises);
    return results.some((result) => result === true);
  }

  // URL에서 HTML 데이터를 비동기적으로 가져오는 함수
  private async fetchUrl(url: string): Promise<string | null> {
    try {
      const response: AxiosResponse<string> = await firstValueFrom(
        this.httpService.get(url),
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching URL: ${url}`, error);
      return null;
    }
  }

  // HTML에서 모든 링크를 추출하는 함수
  private extractLinksFromHtml(html: string): string[] {
    const $ = cheerio.load(html);
    const links: string[] = [];
    $('a[href]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) links.push(href);
    });
    return links;
  }
}
