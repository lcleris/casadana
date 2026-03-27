FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
COPY packages ./packages
COPY apps/web ./apps/web
COPY .docker/web/nginx.conf ./nginx.conf

RUN bun install --frozen-lockfile
RUN bun --cwd apps/web build

FROM nginx:alpine

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
