# Knowledge Project

Knowledge Project is a multi-module knowledge base system scaffold. It includes
Spring Boot APIs, a manager frontend, a public frontend placeholder, PostgreSQL
with pgvector, Redis-backed Sa-Token state, and a Python LangChain placeholder
service.

## Modules

| Path | Purpose |
| --- | --- |
| `service/` | Shared Java entities, mappers, services, Flyway migrations, and common API response types. |
| `manager-api/` | Spring Boot manager/admin API on port `8081`. |
| `front-api/` | Spring Boot public frontend API on port `8080`. |
| `front-manager-end/` | Vite + React + TypeScript manager frontend. |
| `front-end/` | Public frontend placeholder. |
| `docker/` | Local Docker Compose setup for PostgreSQL + pgvector and Redis. |
| `py-langchain/` | Python FastAPI/LangChain placeholder service. |

## Requirements

- Java 21
- Maven
- Node.js with pnpm or npm
- Docker, for local PostgreSQL and Redis

## Local Infrastructure

Start PostgreSQL and Redis:

```powershell
docker compose -f docker\docker-compose.yml up -d
```

Start only Redis:

```powershell
docker compose -f docker\docker-compose.yml up -d redis
```

Default local PostgreSQL settings:

```text
database: knowledge_project
username: user
password: 123456
port: 5432
```

Flyway migrations run from `service/src/main/resources/db/migration` when the
Java APIs start. The manager seed migration creates:

```text
username: admin
password: admin123
```

Default local Redis settings:

```text
host: localhost
port: 6380
database: 0
password: empty
```

Redis runs in Compose as service `redis` on container port `6379`, exposed to
the host as `localhost:6380`. Both `manager-api` and `front-api` use Redis for
Sa-Token session/token storage through `spring.data.redis`.

Override Redis settings for either API with environment variables:

```powershell
$env:REDIS_HOST='localhost'
$env:REDIS_PORT='6380'
$env:REDIS_DATABASE='0'
$env:REDIS_PASSWORD=''
```

## Backend

Compile and test both Java APIs:

```powershell
$env:JAVA_HOME='C:\Program Files\Java\jdk-21.0.11'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
mvn -pl manager-api,front-api -am test
```

The project targets Java 21. If Maven reports class version errors, check
`mvn -version` and set `JAVA_HOME` to a JDK 21 install before running Maven.

Run the manager API:

```powershell
$env:JAVA_HOME='C:\Program Files\Java\jdk-21.0.11'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
mvn -pl manager-api -am -DskipTests package
java -jar manager-api\target\manager-api-0.0.1-SNAPSHOT.jar
```

Manager API URL:

```text
http://localhost:8081
```

When running from IntelliJ IDEA, start `docker/docker-compose.yml` first so
PostgreSQL and Redis are available, then run `ManagerApplication`.

Run the public frontend API:

```powershell
$env:JAVA_HOME='C:\Program Files\Java\jdk-21.0.11'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
mvn -pl front-api -am spring-boot:run
```

Public API URL:

```text
http://localhost:8080
```

## Manager Frontend

Install dependencies and start Vite:

```powershell
cd front-manager-end
pnpm install
pnpm dev
```

Manager frontend URL:

```text
http://localhost:5173
```

During local development, Vite proxies `/api/*` to:

```text
http://localhost:8081
```

Override the proxy target if needed:

```powershell
$env:VITE_PROXY_API_TARGET='http://localhost:8081'
pnpm dev
```

## Manager Rules

- Manager frontend code lives in `front-manager-end/`.
- Manager backend APIs live in `manager-api/`.
- Manager API responses should use `ApiResult<T>`.
- Manager frontend API calls should use `/api/...` and the Vite proxy in development.
- Manager menus are stored in `sys_menu` and assigned through `sys_role_menu`.
- Default manager routes use two-level paths such as `/system/users`.

## Useful Checks

```powershell
$env:JAVA_HOME='C:\Program Files\Java\jdk-21.0.11'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
mvn -pl manager-api,front-api -am test
docker compose -f docker\docker-compose.yml config
docker exec knowledge-project-redis redis-cli ping
cd front-manager-end
pnpm exec tsc -b --pretty false
pnpm build
```
