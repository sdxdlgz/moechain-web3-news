# MoeChain Web3 新闻推送服务

基于 Bun + TypeScript 的新闻推送服务，支持从多种新闻源获取新闻并通过 MoePush 进行推送。

## 功能

- 支持从 方程式新闻 获取新闻
- 使用 MoePush 进行新闻推送
- 可扩展的架构，方便添加更多新闻源

## 安装

```bash
git clone https://github.com/moechain-tools/moechain-web3-news.git
cd moechain-web3-news

bun install
```

## 配置

在项目根目录创建 `.env` 文件，参考以下内容进行配置：

```
# MoePush 配置
MOEPUSH_URL=https://your-moepush-url.com/api

# 新闻源配置
POLL_INTERVAL=10 # 轮询间隔（秒）

# 日志配置
LOG_LEVEL=info # 可选值: trace, debug, info, warn, error, silent
```

## 运行

```bash
bun run start
```

## 数据库

服务使用 Bun 内置的 SQLite 功能存储已处理的新闻 ID，避免重复推送。数据库文件保存在 `news.db`，包含以下表：

- `processed_news` 表：存储已处理的新闻 ID
  - `id`: 新闻唯一标识

## 架构设计

### 适配器模式

项目使用适配器模式将不同格式的新闻源数据转换为统一的 NewsItem 格式：

- `src/adapters/rss.ts`: RSS 格式基础适配器
- `src/adapters/bwe.ts`: BWE 数据源的专用适配器

### 新闻源

- `src/sources/base.ts`: 新闻源基类，提供通用功能
- `src/sources/bwe.ts`: BWE 新闻源实现

### 服务和过滤器

- `src/services/moepush.ts`: MoePush 推送服务
- `src/filters/sqlite.ts`: SQLite 新闻过滤器，避免重复推送

## 添加新的新闻源

1. 在 `src/adapters` 目录下创建新的适配器（如果需要）
2. 在 `src/sources` 目录下创建新的新闻源类，继承 `BaseNewsSource`
3. 在 `src/index.ts` 中的 `NewsService` 类的 `sources` 数组中添加新的新闻源实例

## 许可证

MIT 