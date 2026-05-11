-- TODO: Flyway 初始化 SQL 占位，首次部署前请结合真实业务字段调整。
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS kb_role (
    id BIGSERIAL PRIMARY KEY,
    role_code VARCHAR(64) NOT NULL UNIQUE,
    role_name VARCHAR(128) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kb_user (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(128) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kb_user_role (
    user_id BIGINT NOT NULL REFERENCES kb_user(id),
    role_id BIGINT NOT NULL REFERENCES kb_role(id),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS kb_document (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kb_document_vector (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT NOT NULL REFERENCES kb_document(id),
    chunk_text TEXT NOT NULL,
    -- TODO: 1536 仅为占位维度，需与实际 embedding 模型输出维度一致。
    embedding vector(1536),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TODO: 数据量增长后评估 ivfflat/hnsw 索引参数。
CREATE INDEX IF NOT EXISTS idx_kb_document_vector_document_id ON kb_document_vector(document_id);
