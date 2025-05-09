import { Database } from 'bun:sqlite';
import type { NewsItem, NewsFilter } from '../types';

class SQLiteNewsFilter implements NewsFilter {
  private db: Database;

  constructor() {
    this.db = new Database('news.db');
    this.init();
  }

  private init() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS processed_news (
        id TEXT PRIMARY KEY
      )
    `);
  }

  private async isExists(newsId: string): Promise<boolean> {
    const result = this.db.query(`SELECT 1 FROM processed_news WHERE id = ?`).get(newsId);
    return !!result;
  }

  async filter(newsList: NewsItem[]): Promise<NewsItem[]> {
    const filteredNews: NewsItem[] = [];
    
    for (const news of newsList) {
      const exists = await this.isExists(news.id);
      if (!exists) {
        filteredNews.push(news);
      }
    }
    
    return filteredNews;
  }

  async add(news: NewsItem): Promise<void> {
    this.db.run(`
      INSERT INTO processed_news (id)
      VALUES (?)
    `, [
      news.id,
    ]);
  }
}

export default SQLiteNewsFilter;
