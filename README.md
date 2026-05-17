# Knowledge Project

Knowledge Project is a multi-module knowledge base system scaffold. It includes
Spring Boot APIs, a manager frontend, a public frontend placeholder, PostgreSQL
with pgvector, and a Python LangChain placeholder service.

## Modules

| Path | Purpose |
| --- | --- |
| `service/` | Shared Java entities, mappers, services, Flyway migrations, and common API response types. |
| `manager-api/` | Spring Boot manager/admin API on port `8081`. |
| `front-api/` | Spring Boot public frontend API on port `8080`. |
| `front-manager-end/` | Vite + React + TypeScript manager frontend. |
| `front-end/` | Public frontend placeholder. |
| `postgresql/` | Local PostgreSQL + pgvector Docker Compose setup. |
| `py-langchain/` | Python FastAPI/LangChain placeholder service. |

## Requirements

- Java 21
- Maven
- Node.js with pnpm or npm
- Docker, for local PostgreSQL

## Database

Start PostgreSQL:

```powershell
cd postgresql
docker compose up -d
```

Default local database settings:

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

## Backend

Compile and test:

```powershell
$env:JAVA_HOME='C:\Program Files\Java\jdk-21.0.11'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
mvn -pl manager-api -am test
```

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
- Manager permissions are stored in `permissions` and assigned through `role_permission`.
- Default manager routes use two-level paths such as `/system/users`.

## Useful Checks

```powershell
mvn -pl manager-api -am test
cd front-manager-end
pnpm exec tsc -b --pretty false
pnpm build
```
