import type { Output as RssOutput, Item as RssItem } from 'rss-parser';
import type { NewsItem, NewsAdapter } from '../types';

export class RssAdapter implements NewsAdapter<RssOutput<any>> {
  adapt(feed: RssOutput<any>, sourceName: string): NewsItem[] {
    if (!feed.items || !Array.isArray(feed.items)) {
      return [];
    }
    
    return feed.items.map((item: RssItem) => {
      return {
        id: this.generateId(item, sourceName),
        title: item.title || '无标题',
        content: this.extractContent(item),
        link: item.link || '',
        pubDate: this.formatDate(item.pubDate),
        source: sourceName
      };
    });
  }
  
  protected generateId(item: any, sourceName: string): string {
    if (item.guid) {
      return `${sourceName}:${item.guid}`;
    }
    const title = item.title || '';
    const date = item.pubDate || item.date || new Date().toISOString();
    return `${sourceName}:${title}:${date}`;
  }
  
  private formatDate(dateStr: string | undefined): Date {
    if (!dateStr) {
      return new Date();
    }
    
    try {
      return new Date(dateStr);
    } catch (e) {
      console.error('日期格式化错误:', e);
      return new Date();
    }
  }
  

  private extractContent(item: RssItem): string {
    const extendedItem = item as RssItem & {
      'content:encoded'?: string;
      description?: string;
    };
    
    return extendedItem.content || 
           extendedItem.contentSnippet || 
           extendedItem['content:encoded'] || 
           extendedItem.description || 
           '无内容';
  }
} 