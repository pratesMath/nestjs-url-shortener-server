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
pnpm add uuid date-fns class-transformer class-validator helmet drizzle-orm pg @nestjs/config zod argon2 @nestjs/jwt @nestjs/passport passport-jwt ioredis
# Install dev dependencies
pnpm add -D @types/helmet drizzle-kit @types/pg tsx

# Install vitest to configure test environment
pnpm add -D vitest unplugin-swc vite-tsconfig-paths @swc/core dotenv
```

<h3>Applying RSA Algorithm</h3>

1. Generate private & public Key files
```SH
# Generate private key
openssl genpkey -algorithm RSA -out private-key.pem -pkeyopt rsa_keygen_bits:2048
# Generate public key thought private key
openssl rsa -pubout -in private-key.pem -out public-key.pem
```

2. Generate private & public Key in base64 format
```SH
# Generate base64 from "private-key.pem"
base64 private-key.pem > private-key.txt
# Generate base64 from "public-key.pem"
base64 public-key.pem > public-key.txt
```

3. last step: copy code from `private-key.txt` and `public-key.txt` files and paste in their respective `.env` file. And just to finish, delete all this generated files from steps 1 and 2.