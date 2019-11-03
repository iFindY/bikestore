CREATE TABLE
    bike
(
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


INSERT INTO bike (id, contact, email, model, name, phone, purchase_date, purchase_price)
VALUES (1, 'true', 'jeff@bikes.com', 'Globo MTB 29 Full Suspension', 'Jeff Miller', '328-443-5555','2013-06-01', '1100');
INSERT INTO bike (id, contact, email, model, name, phone, purchase_date, purchase_price)
VALUES (2, 'false', 'samantha@bikes.com', 'Globo Carbon Fiber Race Series', 'Samantha Davis', '448-397-5555', '2014-06-01', '1999');
INSERT INTO bike (id, contact, email, model, name, phone, purchase_date, purchase_price)
VALUES (3, 'true', 'dave@bikes.com', 'Globo Time Trial Blade', 'Dave Warren', '563-891-5555', '2015-06-01', '2100');
