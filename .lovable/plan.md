

## Plan: Create Dockerfile for React + Vite Project

### Project Analysis
- **Stack**: React 18 + Vite 5 + TypeScript
- **Package Manager**: bun (has bun.lock/bun.lockb files) with npm fallback
- **Build Port**: 8080
- **Output**: Static files from `dist/` folder after `vite build`

### Approach: Multi-stage Build
Using multi-stage Docker build for optimized production image:

1. **Build Stage** (`oven/bun:1-alpine` or `node:20-alpine`)
   - Install dependencies with bun
   - Run `bun run build` to create production bundle

2. **Serve Stage** (`nginx:alpine`)
   - Copy built files from `/dist` to nginx html directory
   - Configure nginx to handle SPA routing (redirect 404s to index.html)

### Files to Create
| File | Purpose |
|------|---------|
| `Dockerfile` | Main multi-stage build configuration |
| `.dockerignore` | Exclude node_modules, .git, etc. from build context |

### Dockerfile Structure
```dockerfile
# Stage 1: Build
FROM oven/bun:1-alpine AS builder
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

### nginx.conf (SPA routing)
```nginx
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
  }
}
```

### .dockerignore
```
node_modules
dist
.git
.dockerignore
Dockerfile
```

### Build & Run Commands
```bash
docker build -t medipredict .
docker run -p 8080:80 medipredict
```

