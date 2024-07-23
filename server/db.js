const pg = require("pg");
const uuid = require("uuid");

const client = new pg.Client(
  process.env.DATABASE_URL ||
    "postgres://localhost/the_acme_reservation_planner"
);

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS reservation;
    DROP TABLE IF EXISTS customer;
    DROP TABLE IF EXISTS restaurant;

    CREATE TABLE customer(
       id UUID PRIMARY KEY,
       name VARCHAR(100) NOT NULL
    );
    CREATE TABLE restaurant(
        id UUID PRIMARY KEY,
        name VARCHAR(250) NOT NULL
    );
    CREATE TABLE reservation(
        id UUID PRIMARY KEY,
        date DATE NOT NULL,
        party_count INTEGER NOT NULL,
        customer_id UUID REFERENCES customer(id) NOT NULL,
        restaurant_id UUID REFERENCES restaurant(id) NOT NULL
    );
    `;

  await client.query(SQL);
};

const createCustomer = async ({ name }) => {
  const SQL = `INSERT INTO customer(id, name) VALUES($1, $2) RETURNING *;`;
  const dbResponse = await client.query(SQL, [uuid.v4(), name]);
  return dbResponse.rows[0];
};

const createRestaurant = async ({ name }) => {
  const SQL = `INSERT INTO restaurant(id, name) VALUES($1, $2) RETURNING *;`;
  const dbResponse = await client.query(SQL, [uuid.v4(), name]);
  return dbResponse.rows[0];
};

const createReservation = async ({
  date,
  party_count,
  customer_id,
  restaurant_id,
}) => {
  const SQL = `
        INSERT INTO reservation(id, date, party_count, customer_id, restaurant_id)
            VALUES($1, $2, $3, $4, $5) RETURNING *;
    `;

  const dbResponse = await client.query(SQL, [
    uuid.v4(),
    date,
    party_count,
    customer_id,
    restaurant_id,
  ]);
  return dbResponse.rows[0];
};

const destroyReservation = async ({ id, customer_id }) => {
  const SQL = `DELETE FROM reservation WHERE id=$1 AND customer_id=$2`;

  await client.query(SQL, [id, customer_id]);
};

const fetchCustomers = async () => {
  const SQL = `SELECT * FROM customer;`;

  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
};

const fetchRestaurants = async () => {
  const SQL = `SELECT * FROM restaurant;`;

  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
};

const fetchReservations = async () => {
  const SQL = `SELECT * FROM reservation;`;

  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
};

module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  destroyReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
};
