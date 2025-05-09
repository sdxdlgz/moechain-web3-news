import type { NewsItem, PushService } from '../types';

export class MoePushService implements PushService {
  private url: string;

  constructor() {
    this.url = process.env.MOEPUSH_URL || '';
    
    if (!this.url) {
      throw new Error('MOEPUSH_URL 未配置');
    }
  }

  async push(news: NewsItem): Promise<boolean> {
    try {            
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(news)
      });
      
      if (response.ok) {
        console.log(`成功推送新闻: ${news.id}`);
        return true;
      }
      
      console.error(`推送失败: ${response.status} - ${response.statusText}`);
      return false;
    } catch (error) {
      console.error('推送新闻时出错:', error);
      return false;
    }
  }
} 