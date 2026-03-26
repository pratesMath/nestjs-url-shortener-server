<h1 align="center">NestJS URL Shortener Server</h1>

This "NestJS URL Shortener Server" was developed to Teddy Open Finance as back-end developer test.

## 🚀 Stack

- **NodeJS + NVM** - NVM is Node Package Manager;
- **PNPM** - fast and modern npm alternative;
- **NestJS** - as back-end framework;
- **Docker** - for deploy, virtualization and test environment;
- **Vitest** - as modern task framework;
- **PostgreSQL** - relational database;
  - Database separated in 2 schemas:
    - auth;
    - url_shortener;
- **Drizzle ORM** - modern and lightweight database ORM;
- **UUID V7** - I chose UUID V7 instead of UUID V4, for some reasons:
  - UUID V7 brings time-sortable uuid aproach that solves the index database fragmentation (good with **B-Tree index**);
  - UUID V7 constains a 48 bits timestamp at start;
  - UUID V7 is more secure and efficient, ensuring fast write operations with lower CPU/IO consumption in databases;
- **RS256 for JWT** - further explanations below.:
- **Argon2** - used for password hash, reason:
  - customized:
    - Memory Cost (*m*): How much RAM the algorithm will use;
    - Time Cost (*t*): How many iterations it will perform on memory;
    - Parallelism (*p*): How many processor threads it can occupy;
  - **NOTE**: In 2015, won the *Password Hashing Competition* (PHC), beating **Bcrypt** and **Scrypt**.

This project was not built as a microservice, but as a modular monolith. Reasons:
- Reduced evelopment time;
- Higher development complexity;
- Greater configuration of network services (Docker, RabbitMQ, Redis, PostgreSQL, etc.);
- Higher project cost in a production environment;

**NOTE**: I envisioned this project as an MVP, where as the project grew and the need arose, I could:
- Isolate each module as a domain, each with its own area of ​​expertise and business;

## 💻 1# Requirements to run this project

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

## 🔐 2# .env file

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
JWT_PRIVATE_KEY=LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2QUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktZd2dnU2lBZ0VBQW9JQkFRRGNQYjFUZFlESnZMSzUKYUZIMzFmbmRyaTNVQTF4YmNWeGRkdHRZaXVkaVpUYUV4RHZ4aGNGdkVycVpUaUNMSWIxMTZnT2RzU3hlQVE0MAo5UmtVRDNQMW9MKzd3TDNFWHAzVGdXbjJzSmF4UVc2cklBZkNYOU1BWm9HNk02NWJaYmkxeDdDK1pycFhkYmxwCkpTQms3cWhHR3pXTEJ0RXlMRG9pTHpRR3hUN2pJSmFTVXJXemJZR3F5c2ZQbko4b2RXeE1keG9RUG51SldaR1MKK2tpWSt1MVZqblNYM1NjdXh1bXI4ME1QTVRab0lGQnMxMklTWG9Ld2c3RUoyMk5uQmJhbis0VkVYbHhKRHhwUAplemp1ZWM3R3l3SUxVVTdCa3JvV2FMUjNzWVhmZ2RFZ0pQdzZCbjdEM1Y5dEFSREpHRXFzL0FrQzkrT2Q5Q0poCk5BNW5WU2dQQWdNQkFBRUNnZ0VBQkwwc0JJNkwzd3RqNUhCckNjUlN2dU0wdk9kTG0vTnUvakNFc2hMZkVyTnYKS1F2WWthOEQ4QUlTVTNmUkR4MVg2SFhJdzgwSy9DOS85a0lWMnVRbGtISDMzakF5QlNFc3VvblhnQVdNWUlrSApaV3JvTDlXdkFuR3lOZWI1eC9hdGlFcDJoNStmUDlXRkpVN2dDUkZIa1ZGRzVYOFg0NWFuQ09oRXh0RXZYcm9MCnV6NFlZOGtMeG5KdDZMZFBYSTNGWVg3N3Z3YnJKTFF3VXdGWWNreDA3Q1k4OHJkaTdkUGxHUkQvSlRLUE5VV2sKVXlueDlyZkl3RGtvNDBqUmZUczR6WlBDNmNYUjJYNHNjaVFKVkhrT3NVajYxVUtiQUdsYkptNGdpTmppRVhlSwoyemFjeHNKZEo0ODBiNndoRmY3SVlEOE5IcVpUemExZnlHUnNERTRERVFLQmdRRHdQQkhPdjA1VXFNMHlrcENrCkZhRXBhaHgwKzRPVnQ5THZTaG03TWFXRXBWVFdiVWtoMUJ6SVk4MkJlUzJ6WHN5VTQrZDZNUTBXLzhDdytGV2QKZ3ViMHZBL3pCanVlblBiaHRHZmcrMUs0M0tRTVVTY01MK1ZPb0xTWndPcmpnb0xzZ211d0krQ1NnM00rTGt1dQpWL2l2eGZMOHpzQVI5b05iMkltRXJOTE5Id0tCZ1FEcXNjZlNibDZjMWtOWnF0YUlvMWNhSkFrSGlKemFOVUJmCmtHN2pOdy9XNUxpZDV2d3E1TkU4SUZmU2pneWkzZGh6T2htcXM4UnVZY2MvQ3RRbDZvYkY1REZ2YVV5MjlZWFoKOTRya1pnNlQvZURkVEFNdWdZUWJ4ZFUyR2NwQUJ0WGQrVWticTFFOFN6M2RqYUxDbXNlN3dYaFROYTRSMjRLTApGNDkvNG1CWEVRS0JnRWVWSHBsRVY4clNJWktZS1pFN0FMS2VjNnhINVlXUEtNTTBpVVpHSE5QUmo5MzA0bjI1Ci9ubVhnM3k0NXUwenFqSVRWcjRLTDZSU3dNLzZyMGduNFRtN2IrVXlUa0dNOCtOOUpoYmJ6R0paSEdpdkpidHoKNmhmcnV1UzFuMGY3YzVlVnBSRHZIOU9JWjZaM2xRVjJJUnYvRjlCTXF0NnZYYVRZZU9HWHZaaHhBb0dBS3FhZwpUOGVxL2dtYU44TnFOVzZwdDZCdzI2T2lEYTI3d3lJMlpLaHZBbmlTYkcrN3gvZkpab25pSyt1UXRGQm9zNWdOCmJnNDVWbTRDalp4a0xYZlBna3NVQ05FMEZkUE12VzNWR2VqS0lXN3ozSU9oMkdQRkpGN3hmbUYxZGVsSUdJemoKRWxveDZ5a3BWd2dVV2hWUzB2WTM3YmRGcVEwaFRqRzc3RnV4Y21FQ2dZQnNmb05NaU1ycGthSklRK2lVVW5SdgpTOWNBbDJBblI5VUNSbUxCOTFBRnJPTWdRKzhOK20zcXo2ZzlxQWhNS2kwc0NUMEtEa3d4T29WMmxGSzIyVE8zCmdERDVZc2NoN094M09TdHFkVWU4czRlam83R2FRNGU4ZHplYkZ1RWFDQ2tVYkxHL2I0ODl0aG0xd1dsN3JCZnoKNUcwTEJ0N3VaYnpyNW91R2VtUjR1QT09Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K
JWT_PUBLIC_KEY=LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUEzRDI5VTNXQXlieXl1V2hSOTlYNQozYTR0MUFOY1czRmNYWGJiV0lyblltVTJoTVE3OFlYQmJ4SzZtVTRnaXlHOWRlb0RuYkVzWGdFT05QVVpGQTl6CjlhQy91OEM5eEY2ZDA0RnA5ckNXc1VGdXF5QUh3bC9UQUdhQnVqT3VXMlc0dGNld3ZtYTZWM1c1YVNVZ1pPNm8KUmhzMWl3YlJNaXc2SWk4MEJzVSs0eUNXa2xLMXMyMkJxc3JIejV5ZktIVnNUSGNhRUQ1N2lWbVJrdnBJbVBydApWWTUwbDkwbkxzYnBxL05ERHpFMmFDQlFiTmRpRWw2Q3NJT3hDZHRqWndXMnAvdUZSRjVjU1E4YVQzczQ3bm5PCnhzc0NDMUZPd1pLNkZtaTBkN0dGMzRIUklDVDhPZ1ordzkxZmJRRVF5UmhLclB3SkF2ZmpuZlFpWVRRT1oxVW8KRHdJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==
```

## 🗝️ 3# Applying RSA Algorithm for JWT

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


## 😎 4# Features
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

## 🗂️ 5# Folder Structure
The Project folder structure was implemented inspired on bellow imagem from **Clean Architecture** book (by Robert C. Martin).
- I made a mix of **Clean Arch and DDD (Domain Driven Design)**;


<div align="center">
  <img src=".github/images/the-clean-architecture.jpg" alt="" width="500">
  <p><i>Clean Architecture</i></p>
</div>

```TXT
src/
- config/ - Global provider configurations (Auth, Redis, DB, etc.)
  - auth/ - JWT/Passport strategies and guards
  - cache/ - Redis setup and connection
  - database/ - ORM connection and global DB settings
  - docs/ - Swagger/OpenAPI documentation setup
  - env/ - Environment variable validation (Zod/Class-validator)
  - security/ - CORS, Helmet, and encryption global setups
- modules/ - High-level business features (Bounded Contexts)
  - <module-name>/ - Specific domain/feature folder name
    - application/ - Orchestration layer (Use Cases)
      - dtos/ - Data transfer objects
        - input/ - Request validation schemas
        - output/ - Response serialization
      - errors/ - Business logic exception definitions
      - use-cases/ - Application rules and logic flows
    - domain/ - Core business logic (Pure TS only)
      - entities/ - Domain models with business rules
      - repositories/ - Abstract interfaces for data access
      - services/ - Complex domain-specific logic
      - value-objects/ - Immutable descriptive attributes
    - infra/ - Technical implementations (Framework/Tools)
      - cryptography/ - Password hashing and token generation
      - database/ - ORM/Query-Builder/Native Database Driver concrete implementations
        - mapper/ - Domain-to-Persistence data conversion
        - repositories/ - Data access implementations
      - http/ - Delivery mechanism (perfect fit w/ NestJS)
        - controllers/ - Request entry points and routing
        - presenters/ - Data formatting for the UI/API
- shared/ - Reusable code across multiple modules
  - entities/ - Base classes or cross-module entities
  - errors/ - Generic exception classes (e.g., UseCaseError)
  - libs/ - Third-party wrappers or utility functions
  - types/ - Global TypeScript definitions and interfaces
```


## 👨‍💻 6# NPM Scripts added

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

## ℹ️ 7# Project Dependencies

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