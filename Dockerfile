FROM oven/bun:latest

COPY public ./public
COPY src ./src
COPY bun.lockb .
COPY package.json .
COPY tsconfig.json .

RUN bun install

CMD bun run start
