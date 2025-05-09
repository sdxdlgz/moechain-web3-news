import type { NewsAdapter, NewsItem } from '../types';
import type { Flash } from '../types/blockBeats';

export class BlockBeatsAdapter implements NewsAdapter<Flash[]> {
  private convertHtmlToMarkdown(htmlContent: string): string {
    let markdownContent = htmlContent

    // 替换换行标签
    markdownContent = markdownContent.replace(/<br\s*\/?>/gi, '\n\n')
                      .replace(/<\/?p>/gi, '\n\n');

    return markdownContent.trim();
  }

  private stripQueryParams(url: string): string {
    try {
      const parsedUrl = new URL(url)
      return `${parsedUrl.origin}${parsedUrl.pathname}`
    } catch (error) {
      console.warn('无效的URL，无法移除查询参数:', url)
      return url
    }
  }

  adapt(sourceData: Flash[], sourceName: string): NewsItem[] {
    if (!sourceData || sourceData.length === 0) {
      return [];
    }

    return sourceData.map(item => {
      const pubDate = new Date(item.create_time);

      // 转换HTML标签为Markdown语法
      const markdownContent = this.convertHtmlToMarkdown(item.content)

      // 移除图片URL中的查询参数，并构建图片Markdown
      const cleanImageUrl = item.pic ? this.stripQueryParams(item.pic) : ''
      const imageMarkdown = cleanImageUrl ? `![图片](${cleanImageUrl})\n\n` : ''

      // 构建文本内容，图片放在最前面，并进行判空
      const content = `${imageMarkdown}### ${item.title}\n${markdownContent}`

      return {
        id: `${sourceName}:${item.id}`,
        title: item.title,
        content,
        link: item.link || item.url,
        pubDate,
        source: sourceName
      };
    });
  }
} 