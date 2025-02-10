# Build UI stage
FROM oven/bun:latest AS build-ui

WORKDIR /app

# Copy package files for UI
COPY ui/package.json ui/bun.lock ./ui/

# Install UI dependencies
WORKDIR /app/ui
RUN bun install

# Copy UI source files
COPY ui/ .

# Build UI
RUN bun run build

# Build server stage
FROM oven/bun:latest AS build-server

WORKDIR /app

# Copy package files for server
COPY package.json bun.lock ./

# Install server dependencies
RUN bun install

# Copy server source files
COPY server/ ./server/

# Copy built UI files from previous stage
COPY --from=build-ui /app/ui/dist ./ui/dist

EXPOSE 3030

CMD ["bun", "run", "start"]