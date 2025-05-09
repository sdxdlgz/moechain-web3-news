import type { NewsItem, NewsFilter } from '../types';
import logger from '../utils/logger';

class KVNewsFilter implements NewsFilter {
  private kv: KVNamespace;
  private readonly EXPIRATION_TTL = 7 * 24 * 60 * 60; // 7天过期时间（秒）

  constructor(kv: KVNamespace) {
    this.kv = kv;
  }

  private async isExists(newsId: string): Promise<boolean> {
    const result = await this.kv.get(newsId);
    return result !== null;
  }

  async filter(newsList: NewsItem[]): Promise<NewsItem[]> {
    const filteredNews: NewsItem[] = [];
    
    for (const news of newsList) {
      try {
        const exists = await this.isExists(news.id);
        if (!exists) {
          filteredNews.push(news);
        }
      } catch (error) {
        logger.error(`检查新闻 ${news.id} 时出错:`, error);
      }
    }
    
    return filteredNews;
  }

  async add(news: NewsItem): Promise<void> {
    try {
      await this.kv.put(news.id, Date.now().toString(), {
        expirationTtl: this.EXPIRATION_TTL
      });
    } catch (error) {
      logger.error(`保存新闻 ${news.id} 时出错:`, error);
    }
  }
}

export default KVNewsFilter; 