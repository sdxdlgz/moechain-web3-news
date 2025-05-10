import type { Item as RssItem, Output as RssOutput } from 'rss-parser';
import { RssAdapter } from './rss';
import type { NewsItem } from '../types';

export class BWEAdapter extends RssAdapter {
  private convertHtmlToMarkdown(htmlContent: string): string {
    let markdownContent = htmlContent

    // 替换换行标签
    markdownContent = markdownContent.replace(/<br\s*\/?>/gi, '\n\n')
                      .replace(/————————————/gi, '\n\n时间:\n\n')
                      .replace(/source:/gi, '\n\n来源:\n\n');

    return markdownContent.trim();
  }

  adapt(feed: RssOutput<any>, sourceName: string): NewsItem[] {
    feed.items = feed.items.map((item: RssItem) => {
      const title = this.convertHtmlToMarkdown(item.title || '');
      return {
        ...item,
        image: '',
        title,
        content: title
      };
    });

    return super.adapt(feed, sourceName);
  }

  protected generateId(item: RssItem, sourceName: string): string {
    const match = item.link?.match(/t\.me\/BWEnews\/(\d+)/);
    if (match && match[1]) {
      const telegramId = match[1];
      return `${sourceName}:${telegramId}`;
    }

    return super.generateId(item, sourceName);
  }
} 