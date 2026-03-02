CREATE TABLE person(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    balance INTEGER NULL,
    time_of_creation TIMESTAMP DEFAULT NOW(),
    password VARCHAR(255) NOT NULL
);
CREATE TABLE post(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    time_of_creation TIMESTAMP DEFAULT NOW(),
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES person (id)
);