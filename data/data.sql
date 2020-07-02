DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS statuses CASCADE;

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

CREATE TABLE cards
(
    id        SERIAL PRIMARY KEY,
    board_id  INTEGER REFERENCES boards(id) ON DELETE CASCADE  NOT NULL,
    title     VARCHAR(255) NOT NULL,
    status_id INTEGER REFERENCES statuses(id) ON DELETE CASCADE NOT NULL,
    "order"   INTEGER NOT NULL
);

INSERT INTO statuses(title)
VALUES ('New'),
       ('In progress'),
       ('Testing'),
       ('Done');

INSERT INTO boards(title)
VALUES ('Board 1'),
       ('Board 2');

