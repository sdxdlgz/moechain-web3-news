FROM oven/bun:slim

WORKDIR /app

ENV POLL_INTERVAL=10
ENV MOEPUSH_URL=

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .

RUN bun run build:linux

VOLUME ["/app"]

EXPOSE 3000

CMD ["./moechain-web3-news-linux-x64"] 