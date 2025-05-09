import { BWENewsSource } from './sources/bwe';
import { MoePushService } from './services/moepush';
import type { NewsSource } from './types';
import SQLiteNewsFilter from './filters/sqlite';
import logger from './utils/logger';


class NewsService {
  private sources: NewsSource[] = [new BWENewsSource()];
  private pushService = new MoePushService();
  private filterService = new SQLiteNewsFilter();
  private isRunning = false;

  async start() {
    logger.important('新闻推送服务启动...');

    this.isRunning = true;
    
    this.startPolling();
  }

  async stop() {
    this.isRunning = false;
    logger.info('新闻推送服务已停止');
  }

  private async startPolling() {
    const intervalSeconds = process.env.POLL_INTERVAL || '10';
    const intervalMs = parseInt(intervalSeconds, 10) * 1000;
    
    logger.info(`已设置轮询，每 ${intervalSeconds} 秒执行一次`);
    
    while (this.isRunning) {
      if (!this.isRunning) break;
      
      await this.fetchAndPushNews();

      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }

  private async fetchAndPushNews() {
    logger.debug('开始获取新闻...');
    
    for (const source of this.sources) {
      try {
        logger.info(`从 ${source.name} 获取新闻...`);
        const news = await source.fetchNews();
        
        if (news.length > 0) {
          logger.info(`获取到 ${news.length} 条新闻，准备过滤和推送...`);
          
          const newsToPush = await this.filterService.filter(news);
          
          logger.info(`过滤后有 ${newsToPush.length} 条新闻需要推送`);
          
          if (newsToPush.length > 0) {
            logger.groupStart('开始推送新闻');
            
            let completed = 0;
            const total = newsToPush.length;
            
            for (let i = 0; i < total; i++) {
              const item = newsToPush[i];
              const success = await this.pushService.push(item);
              
              if (success) {
                await this.filterService.add(item);
                logger.success(`成功推送并保存新闻: ${item.title}`);
                completed++;
                logger.progress('推送进度', (completed / total) * 100);
              }
            }
            
            logger.groupEnd();
          }
        } else {
          logger.info('没有新的新闻需要推送');
        }
      } catch (error) {
        logger.error(`处理 ${source.name} 新闻源时出错:`, error);
      }
    }
    
    logger.debug('新闻处理完成');
  }
}

const newsService = new NewsService();
newsService.start().catch(error => {
  logger.error('启动新闻服务失败:', error);
  process.exit(1);
});

process.on('SIGINT', async () => {
  logger.warn('接收到退出信号，正在停止服务...');
  await newsService.stop();
  process.exit(0);
});