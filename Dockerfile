FROM oven/bun:1-alpine AS builder

WORKDIR /app

ARG DATABASE_URL

ENV DATABASE_URL=$DATABASE_URL

COPY package.json bun.lock ./
RUN bun install

COPY . .

RUN bun run build

FROM oven/bun:1-alpine

WORKDIR /app

COPY --from=builder /app/package.json /app/bun.lock ./
RUN bun install --production

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/database database
COPY --from=builder /app/tsconfig.json ./

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

VOLUME ["/app/data"]

# Port exposé
EXPOSE 3000

CMD bun run database && bun run start
