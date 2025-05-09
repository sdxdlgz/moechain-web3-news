import MoePushService from './services/moepush';
import NewsService from './services/news';
import KVNewsFilter from './filters/kv';
import logger from './utils/logger';

export interface Env {
  MOECHAIN_WEB3_NEWS_KV: KVNamespace;
  MOEPUSH_URL: string;
  LOG_LEVEL: string;
}

class CloudflareNewsService extends NewsService {
  constructor(env: Env) {
    const pushService = new MoePushService(env.MOEPUSH_URL);
    const filterService = new KVNewsFilter(env.MOECHAIN_WEB3_NEWS_KV);
    
    if (env.LOG_LEVEL) {
      logger.setLevel(env.LOG_LEVEL as any);
    }
    
    super(pushService, filterService);
  }
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    logger.important('定时任务触发，开始获取新闻...');
    
    const newsService = new CloudflareNewsService(env);
    
    ctx.waitUntil(newsService.fetchAndPushNews());
  },
}; 