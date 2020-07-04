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
INSERT INTO BIKES (id, contact, email, model, name, phone, purchase_date, purchase_price)
VALUES (1, 'true', 'jeff@bikes.com', 'Globo MTB 29 Full Suspension', 'Jeff Miller', '328-443-5555','2013-06-01', '1100');
INSERT INTO BIKES (id, contact, email, model, name, phone, purchase_date, purchase_price)
VALUES (2, 'false', 'samantha@bikes.com', 'Globo Carbon Fiber Race Series', 'Samantha Davis', '448-397-5555', '2014-06-01', '1999');
INSERT INTO BIKES (id, contact, email, model, name, phone, purchase_date, purchase_price)
VALUES (3, 'true', 'dave@bikes.com', 'Globo Time Trial Blade', 'Dave Warren', '563-891-5555', '2015-06-01', '2100');


-- create security tables
CREATE SCHEMA SECURITY
    CREATE TABLE USERS (
        username VARCHAR(50) NOT NULL PRIMARY KEY,
        password VARCHAR(100) NOT NULL,
        email VARCHAR(50) NOT NULL,
        enabled BOOLEAN NOT NULL,
        attempts SMALLINT NOT NULL DEFAULT 3
    )

    CREATE TABLE AUTHORITIES (
        username VARCHAR(50) NOT NULL PRIMARY KEY,
        authority VARCHAR(50) NOT NULl,
        CONSTRAINT fk_authorities_users FOREIGN KEY (username) REFERENCES users(username)
    )

    CREATE UNIQUE INDEX IX_AUTH_USERS ON AUTHORITIES (username, authority);

-- populate security tables
SET SEARCH_PATH = SECURITY;
INSERT INTO USERS (username, password, email, enabled) VALUES ('Frank','{noop}hallo','frank111@mail.de',true);
INSERT INTO USERS (username,password,email, enabled) VALUES ('Peter','{noop}password','peterfff@mail.fr',true);
INSERT INTO USERS (username, password, email, enabled) VALUES ('Manuel','{noop}bitcoin','man@gmail.de',false);

INSERT INTO AUTHORITIES (username, authority) VALUES ('Frank','ADMIN');
INSERT INTO AUTHORITIES (username,authority) VALUES ('Peter','USER');
INSERT INTO AUTHORITIES (username, authority) VALUES ('Manuel','MANAGER');

