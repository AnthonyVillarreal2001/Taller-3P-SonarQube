CREATE TABLE zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT
);

CREATE TABLE spaces (
    id SERIAL PRIMARY KEY,
    zone_id INTEGER,
    number VARCHAR(50),
    status VARCHAR(50)
);