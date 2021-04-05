-- drop all tables
-- DROP SCHEMA PRODUCTS, SECURITY CASCADE;

-- create data tables
CREATE SCHEMA PRODUCTS
    CREATE TABLE BIKES (
        id SERIAL,
        contact BOOLEAN NOT NULL,
        email VARCHAR,
        model VARCHAR,
        name VARCHAR,
        phone VARCHAR,
        purchase_date DATE,
        purchase_price NUMERIC,
        serial_number VARCHAR,
        PRIMARY KEY (id)
    );

-- populate data table
SET SEARCH_PATH = PRODUCTS;
INSERT INTO BIKES (id, contact, email, model, name, phone, purchase_date, purchase_price) VALUES (1, 'true', 'jeff@bikes.com', 'Globo MTB 29 Full Suspension', 'Jeff Miller', '328-443-5555','2013-06-01', '1100');
INSERT INTO BIKES (id, contact, email, model, name, phone, purchase_date, purchase_price) VALUES (2, 'false', 'samantha@bikes.com', 'Globo Carbon Fiber Race Series', 'Samantha Davis', '448-397-5555', '2014-06-01', '1999');
INSERT INTO BIKES (id, contact, email, model, name, phone, purchase_date, purchase_price) VALUES (3, 'true', 'dave@bikes.com', 'Globo Time Trial Blade', 'Dave Warren', '563-891-5555', '2015-06-01', '2100');


-- create security tables
CREATE SCHEMA SECURITY;
    -- set current schema
    SET SEARCH_PATH = SECURITY;

    CREATE TYPE auths AS ENUM ('USER', 'ADMIN', 'MANAGER');

    CREATE TABLE USERS (
        email VARCHAR(50) NOT NULL PRIMARY KEY,
        username VARCHAR(50),
        password VARCHAR(100) NOT NULL,
        enabled BOOLEAN NOT NULL DEFAULT FALSE,
        attempts SMALLINT NOT NULL DEFAULT 3
    );

    CREATE TABLE AUTHORITIES (
        email VARCHAR(50) NOT NULL PRIMARY KEY,
        authority auths NOT NULl DEFAULT 'USER',
        CONSTRAINT fk_authorities_users FOREIGN KEY (email) REFERENCES users(email)
    );
    
    
    CREATE TABLE VERIFICATIONS (
        id    SERIAL PRIMARY KEY,
        email VARCHAR(50)  NOT NULL UNIQUE,
        code  VARCHAR(50)  NOT NULL
    );

    CREATE UNIQUE INDEX IX_AUTH_USERS ON AUTHORITIES (email, authority);


INSERT INTO USERS (username, password, email, enabled) VALUES ('Frank','{noop}Test123!','frank111@mail.de',true);
INSERT INTO USERS (username,password,email, enabled) VALUES ('Peter','{noop}password','peterfff@mail.fr',true);
INSERT INTO USERS (username, password, email, enabled) VALUES ('Manuel','{noop}bitcoin','man@gmail.de',false);

INSERT INTO AUTHORITIES (email, authority) VALUES ('frank111@mail.de','ADMIN');
INSERT INTO AUTHORITIES (email,authority) VALUES ('peterfff@mail.fr','USER');
INSERT INTO AUTHORITIES (email, authority) VALUES ('man@gmail.de','MANAGER');


INSERT INTO VERIFICATIONS (email, code) VALUES ('arkadi2.daschkeiwtsch@gmail.com','2139812DDFFWE');
