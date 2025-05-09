import Bun from 'bun';
import NewsService from './services/news';
import MoePushService from './services/moepush';
import SQLiteNewsFilter from './filters/sqlite';
import logger from './utils/logger';

class BunNewsService extends NewsService {
  private isRunning = false;

  constructor() {
    const pushService = new MoePushService(Bun.env.MOEPUSH_URL);
    const filterService = new SQLiteNewsFilter();
    
    super(pushService, filterService);
  }

  async start(): Promise<void> {
    logger.important('新闻推送服务启动...');
    this.isRunning = true;
    this.startPolling();
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    logger.info('新闻推送服务已停止');
  }

  private async startPolling(): Promise<void> {
    const intervalSeconds = Bun.env.POLL_INTERVAL || '10';
    const intervalMs = parseInt(intervalSeconds, 10) * 1000;
    
    logger.info(`已设置轮询，每 ${intervalSeconds} 秒执行一次`);
    
    while (this.isRunning) {
      if (!this.isRunning) break;
      
      await this.fetchAndPushNews();

      await Bun.sleep(intervalMs);
    }
  }
}

const newsService = new BunNewsService();
newsService.start().catch(error => {
  logger.error('启动新闻服务失败:', error);
  process.exit(1);
});

process.on('SIGINT', async () => {
  logger.warn('接收到退出信号，正在停止服务...');
  await newsService.stop();
  process.exit(0);
});