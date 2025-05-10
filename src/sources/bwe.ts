import Parser from 'rss-parser';
import type { NewsItem } from '../types';
import { BaseNewsSource } from './base';
import { BWEAdapter } from '../adapters/bwe';

export class BWENewsSource extends BaseNewsSource {
  name = 'BWE News';
  private url = 'https://rss-public.bwe-ws.com/'
  private parser = new Parser();
  private adapter = new BWEAdapter();

  async fetchSourceData(): Promise<Parser.Output<any>> {
    const response = await fetch(this.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch source data: ${response.statusText}`);
    }
    const text = await response.text();
    return this.parser.parseString(text);
  }
  
  adaptSourceData(sourceData: Parser.Output<any>): NewsItem[] {
    return this.adapter.adapt(sourceData, this.name);
  }
} 