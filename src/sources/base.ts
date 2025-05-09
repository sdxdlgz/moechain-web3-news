import type { NewsItem, NewsSource } from '../types';

export abstract class BaseNewsSource implements NewsSource {
  abstract name: string;
  
  abstract fetchSourceData(): Promise<any>;
  
  abstract adaptSourceData(sourceData: any): NewsItem[];
  
  async fetchNews(): Promise<NewsItem[]> {
    try {
      const sourceData = await this.fetchSourceData();
      return this.adaptSourceData(sourceData);
    } catch (error) {
      console.error(`获取${this.name}新闻失败:`, error);
      return [];
    }
  }
}
