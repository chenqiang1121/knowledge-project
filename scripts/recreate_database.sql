SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'knowledge_project'
  AND pid <> pg_backend_pid();

DROP DATABASE IF EXISTS knowledge_project;

CREATE DATABASE knowledge_project
    WITH OWNER = "user"
    ENCODING = 'UTF8'
    TEMPLATE = template0;
