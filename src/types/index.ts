export interface NewsItem {
  id: string;
  title: string;
  content: string;
  link: string;
  pubDate: Date;
  source: string;
}

export interface NewsSource {
  name: string;
  fetchNews(): Promise<NewsItem[]>;
}

export interface PushService {
  push(news: NewsItem): Promise<boolean>;
} 

export interface NewsFilter {
  filter(newsList: NewsItem[]): Promise<NewsItem[]>;
  add(news: NewsItem): Promise<void>;
}

export interface NewsAdapter<T> {
  adapt(sourceData: T, sourceName: string): NewsItem[];
}
