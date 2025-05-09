import type { NewsAdapter, NewsItem } from '../types';
import type { Flash } from '../types/blockBeats';

export class BlockBeatsAdapter implements NewsAdapter<Flash[]> {
  adapt(sourceData: Flash[], sourceName: string): NewsItem[] {
    if (!sourceData || sourceData.length === 0) {
      return [];
    }

    return sourceData.map(item => {
      const pubDate = new Date(item.create_time);

      return {
        id: `${sourceName}:${item.id}`,
        title: item.title,
        content: item.content,
        link: item.link || item.url,
        pubDate,
        source: sourceName
      };
    });
  }
} 