FROM mcr.microsoft.com/playwright:v1.61.1-noble

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && pnpm install --frozen-lockfile

COPY . .

ENV HEADLESS=true
ENV TEST_ENV=qa
ENV CUCUMBER_TAGS="@smoke and not @wip"

CMD ["pnpm", "run", "test:ci"]
