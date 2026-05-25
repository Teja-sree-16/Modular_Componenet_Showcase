DROP TABLE IF EXISTS search_logs;
DROP TABLE IF EXISTS usage_logs;
DROP TABLE IF EXISTS collection_components;
DROP TABLE IF EXISTS collections;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS component_versions;
DROP TABLE IF EXISTS component_tags;
DROP TABLE IF EXISTS component_requests;
DROP TABLE IF EXISTS components;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE components (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100),
    tags TEXT,
    version VARCHAR(30) DEFAULT '1.0.0',
    status VARCHAR(30) DEFAULT 'Published',
    preview_image TEXT,
    description TEXT,
    documentation TEXT,
    code_snippet TEXT,
    usage_example TEXT,
    props_table TEXT,
    installation_guide TEXT,
    accessibility_notes TEXT,
    best_practices TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE component_tags (
    id BIGSERIAL PRIMARY KEY,
    component_id BIGINT REFERENCES components(id) ON DELETE CASCADE,
    tag VARCHAR(80) NOT NULL
);

CREATE TABLE component_versions (
    id BIGSERIAL PRIMARY KEY,
    component_id BIGINT REFERENCES components(id) ON DELETE CASCADE,
    version VARCHAR(30) NOT NULL,
    changelog TEXT,
    source_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    component_id BIGINT REFERENCES components(id) ON DELETE CASCADE,
    user_email VARCHAR(150),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
    id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(150),
    component_id BIGINT REFERENCES components(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, component_id)
);

CREATE TABLE collections (
    id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(150),
    name VARCHAR(120) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE collection_components (
    id BIGSERIAL PRIMARY KEY,
    collection_id BIGINT REFERENCES collections(id) ON DELETE CASCADE,
    component_id BIGINT REFERENCES components(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(collection_id, component_id)
);

CREATE TABLE component_requests (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    documentation TEXT,
    requested_by VARCHAR(150),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    message TEXT DEFAULT 'Waiting for admin review.',
    component_id BIGINT REFERENCES components(id) ON DELETE SET NULL,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP
);

CREATE TABLE usage_logs (
    id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(150),
    action VARCHAR(100),
    component_name VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE search_logs (
    id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(150),
    query TEXT NOT NULL,
    result_count INTEGER DEFAULT 0,
    top_component_name VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);