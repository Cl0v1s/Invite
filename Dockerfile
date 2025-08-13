FROM node:20-alpine AS builder

WORKDIR /app

ARG DATABASE_URL
ARG NEXT_PUBLIC_GREETINGS
ARG NEXT_PUBLIC_SENDER
ARG NEXT_PUBLIC_P
ARG NEXT_PUBLIC_ADDRESS
ARG NEXT_PUBLIC_TIME

ENV DATABASE_URL=$DATABASE_URL \
    NEXT_PUBLIC_GREETINGS=$NEXT_PUBLIC_GREETINGS \
    NEXT_PUBLIC_SENDER=$NEXT_PUBLIC_SENDER \
    NEXT_PUBLIC_P=$NEXT_PUBLIC_P \
    NEXT_PUBLIC_ADDRESS=$NEXT_PUBLIC_ADDRESS \
    NEXT_PUBLIC_TIME=$NEXT_PUBLIC_TIME


COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json* /app/pnpm-lock.yaml* /app/yarn.lock* ./
RUN npm install --production && npm install ts-node typescript sqlite3

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/database database
COPY --from=builder /app/tsconfig.json ./

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

VOLUME ["/app/data"]

# Port exposé
EXPOSE 3000

CMD npm run database && npm start
