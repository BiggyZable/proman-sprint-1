DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS statuses CASCADE;
DROP TABLE IF EXISTS status_link CASCADE;

CREATE TABLE boards
(
    id    SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE statuses
(
    id    SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL UNIQUE
);


CREATE TABLE status_link
(
    id        SERIAL PRIMARY KEY,
    status_name VARCHAR,
    board_name VARCHAR
);

CREATE TABLE cards
(
    id        SERIAL PRIMARY KEY,
    board_id  INTEGER REFERENCES boards(id) ON DELETE CASCADE  NOT NULL,
    title     VARCHAR(255) NOT NULL,
    status_id INTEGER REFERENCES status_link(id) ON DELETE CASCADE NOT NULL,
    "order"   INTEGER NOT NULL,
    status_name VARCHAR(255)
);

INSERT INTO statuses(title)
VALUES ('New'),
       ('In progress'),
       ('Testing'),
       ('Done');

INSERT INTO boards(title)
VALUES ('Board 1'),
       ('Board 2');

INSERT INTO status_link(status_name, board_name)
VALUES ('New', 'Board 1'),
       ('In progress', 'Board 1'),
       ('Testing', 'Board 1'),
       ('Done', 'Board 1'),
       ('New', 'Board 2'),
       ('In progress', 'Board 2'),
       ('Testing', 'Board 2'),
       ('Done', 'Board 2');