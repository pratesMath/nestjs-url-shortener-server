<h1 align="center">NestJS URL Shortener Server</h1>

<h3 align="end">Project Dependencies</h3>

**scripts**:

```SH
# Create project using NestJS CLI
nest new nestjs-url-shortener-server # set 'pnpm' as packager manager

# Install BiomeJS as a lightweight alternative to ESLint + Prettier for lint and format source code
pnpm add -D -E @biomejs/biome
## Initialize BiomeJS (will crate a 'biome.json' at project root)
pnpx @biomejs/biome init

# Install (additional) necessary dependencies
pnpm add uuid date-fns class-transformer class-validator helmet drizzle-orm pg @nestjs/config zod argon2 @nestjs/jwt @nestjs/passport passport-jwt
# Install dev dependencies
pnpm add -D @types/helmet drizzle-kit @types/pg

# Install vitest to configure test environment
pnpm add -D vitest unplugin-swc vite-tsconfig-paths @swc/core
```