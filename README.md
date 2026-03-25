<h1 align="center">NestJS URL Shortener Server</h1>

This "NestJS URL Shortener Server" was developed to Teddy Open Finance as back-end developer test.

## 0# Features
**Auth**: `src/modules/auth`
- [X] Authenticate User;
  - [X] use case: `src/modules/auth/application/use-cases/authenticate-user.ts`;
  - [X] unit test: `src/modules/auth/application/use-cases/authenticate-user.spec.ts`;
  - [X] controller: `src/modules/auth/infra/http/controllers/authenticate-user.controller.ts`;
- [X] Edit User;
  - [X] use case: `src/modules/auth/application/use-cases/edit-user.ts`;
  - [X] unit test: `src/modules/auth/application/use-cases/edit-user.spec.ts`;
  - [X] controller: `src/modules/auth/infra/http/controllers/edit-user.controller.ts`;
- [X] Get Profile;
  - [X] use case: `src/modules/auth/application/use-cases/get-profile.ts`;
  - [X] unit test: `src/modules/auth/application/use-cases/get-profile.spec.ts`;
  - [X] controller: `src/modules/auth/infra/http/controllers/get-profile.controller.ts`;
- [X] Password Recover;
  - [X] use case: `src/modules/auth/application/use-cases/password-recover.ts`;
  - [X] unit test: `src/modules/auth/application/use-cases/password-recover.spec.ts`;
  - [X] controller: `src/modules/auth/infra/http/controllers/password-recover.controller.ts`;
- [X] Register User;
  - [X] use case: `src/modules/auth/application/use-cases/register-user.ts`;
  - [X] unit test: `src/modules/auth/application/use-cases/register-user.spec.ts`;
  - [X] controller: `src/modules/auth/infra/http/controllers/register-user.controller.ts`;

**Url Shortener**: `src/modules/url-shortener`
- [X] create-short-link;
  - [X] use case: `src/modules/url-shortener/application/use-cases/create-short-link.ts`;
  - [X] unit test: `src/modules/url-shortener/application/use-cases/create-short-link.spec.ts`;
  - [X] controller: `src/modules/url-shortener/infra/http/controllers/create-short-link.controller.ts`;
- [X] delete-short-link;
  - [X] use case: `src/modules/url-shortener/application/use-cases/delete-short-link.ts`;
  - [X] unit test: `src/modules/url-shortener/application/use-cases/delete-short-link.spec.ts`;
  - [X] controller: `src/modules/url-shortener/infra/http/controllers/delete-short-link.controller.ts`;
- [X] edit-short-link;
  - [X] use case: `src/modules/url-shortener/application/use-cases/edit-short-link.ts`;
  - [X] unit test: `src/modules/url-shortener/application/use-cases/edit-short-link.spec.ts`;
  - [X] controller: `src/modules/url-shortener/infra/http/controllers/edit-short-link.controller.ts`;
- [X] get-original-url-by-short-link;
  - [X] use case: `src/modules/url-shortener/application/use-cases/get-original-url-by-short-link.ts`;
  - [X] unit test: `src/modules/url-shortener/application/use-cases/get-original-url-by-short-link.spec.ts`;
  - [X] controller: `src/modules/url-shortener/infra/http/controllers/get-original-url-by-short-link.controller.ts`;
- [X] get-short-link-by-id;
  - [X] use case: `src/modules/url-shortener/application/use-cases/get-short-link-by-id.ts`;
  - [X] unit test: `src/modules/url-shortener/application/use-cases/get-short-link-by-id.spec.ts`;
  - [X] controller: `src/modules/url-shortener/infra/http/controllers/get-short-link-by-id.controller.ts`;
- [X] get-short-links-by-user-id;
  - [X] use case: `src/modules/url-shortener/application/use-cases/get-short-links-by-user-id.ts`;
  - [X] unit test: `src/modules/url-shortener/application/use-cases/get-short-links-by-user-id.spec.ts`;
  - [X] controller: `src/modules/url-shortener/infra/http/controllers/get-short-links-by-user-id.controller.ts`;

## 1# Requirements to run this project

**Clone the project**

```SH
git clone https://github.com/pratesMath/nestjs-url-shortener-server.git
cd nestjs-url-shortener-server
```

**Install Node.JS 24 (LTS) and pnpm 10**

```SH
# install nvm (link = https://github.com/nvm-sh/nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
# Install NodeJS LTS version (lts = 24)
nvm install --lts
# Use NodeJS LTS
nvm use 24
# Check installation
node -v # and npm -v
# Install pnpm
npm i -g pnpm
```

**Install Docker** - https://docs.docker.com/engine/install/

Type **@recommended** on VSCode Search to install recommended extensions to run this project. They are based on `./vscode/extensions.json`.
- Required extensions:
  - REST Client;
  - BiomeJS;

## 2# .env file

```SH
# .env file

# Server
BASE_URL=http://localhost:7070
NODE_ENV=development
PORT=7070
# Password (Argon2)
PASSWORD_PEPPER=3644bb8d-acd9-48d0-b2f6-73a20fa98d6e_$_3a3b5ba0-d3b6-47dd-ab89-5ad72e74fb33
# Database
DATABASE_URL=postgresql://postgres:docker@localhost:5432/url_shortener_db
# Cache
REDIS_DB=0
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
# CORS
CORS_ORIGIN=*
# Auth (RS256) Private Key + Public Key
JWT_PRIVATE_KEY=<Generate your JWT_PRIVATE_KEY following example bellow.>
JWT_PUBLIC_KEY=<Generate your JWT_PUBLIC_KEY following example bellow.>
```

## 3# Applying RSA Algorithm for JWT

Why do use "**asymmetric keys**"? Simple, for the below advantages:
- The "secret" works with a pair of key (**private** and **public** keys);
  - *private* key generates tokens;
  - *public* only validate them;
- High level **security**;
- Perfect fit on **microservices** scenarios;
  - A centralized auth service that generates all access and refreshes tokens, while another MS's only consume them at HTTP headers (for example);
  - Every MS is now dedicated to your **domain** and **bounded contexts** without worry about authentication;
- It's not complex to handle (but **requires a certificates management**);

**Step 1** - Generate **private** & **public** Key files.
```SH
# Generate private key
openssl genpkey -algorithm RSA -out private-key.pem -pkeyopt rsa_keygen_bits:2048
# Generate public key thought private key
openssl rsa -pubout -in private-key.pem -out public-key.pem
```

**Step 2** - Generate private & public Key in base64 format.
```SH
# Generate base64 from "private-key.pem"
base64 private-key.pem > private-key.txt
# Generate base64 from "public-key.pem"
base64 public-key.pem > public-key.txt
```

**Step 3** - Copy code from `private-key.txt` and `public-key.txt` files and paste in their respective `.env` file variables.
- **NOTE**: Do not forget to delete all this generated files from steps 1 and 2;


## 4# NPM Scripts added

- `biome:format`: uses biome to code format;
- `biome:lint`: uses biome to code lint;
- `biome:check`: uses biome to code lint check;
- `typecheck`: uses tsc (from typescript) to check existing type errors;
- `db:generate`: uses drizzle-kit to generate .sql migrations file;
- `db:migrate`: uses drizzle-kit to apply migrations to database (perfect for production and CI/CD);
- `db:studio`: use drizzle-kit to serve a self hosted database manager (like DBeaver / PGAdmin / Beekeeper);
- `db:seed`: use tsx and drizzle-kit to generate database seed e give an initial environment already seeded;
- `db:push`: use drizzle kit to push your database schema directly to database;
- `test`: use vitest to run all tests. To run a specific test, execute `pnpm run test ./path/to/your/file.spec.ts`;
- `test:watch`: use vitest in watch mode;
- `test:cov`: use vitest to generate coverage after test running after a test execution;
- `test:debug`: use vitest to debug your tests;

## 5# Project Dependencies

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

<br>
<div align="center">
  <h2>Thanks 4 everyone!</h2>
  <p>Made w/ 💙 by <a href="https://github.com/pratesMath">pratesMath</a>.</p>
</div>