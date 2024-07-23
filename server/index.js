const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  destroyReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
} = require("./db");
const express = require("express");

const server = express();

server.use(express.json());

server.get("/api/customers", async (req, res, next) => {
  try {
    const response = await fetchCustomers();
    res.send(response);
  } catch (error) {
    next(error);
  }
});
server.get("/api/restaurants", async (req, res, next) => {
  try {
    const response = await fetchRestaurants();
    res.send(response);
  } catch (error) {
    next(error);
  }
});
server.get("/api/reservations", async (req, res, next) => {
  try {
    const response = await fetchReservations();
    res.send(response);
  } catch (error) {
    next(error);
  }
});
server.post(
  "/api/customers/:customer_id/reservations",
  async (req, res, next) => {
    try {
      const { customer_id } = req.params;
      const reservation = await createReservation({ ...req.body, customer_id });
      res.status(201).send(reservation);
    } catch (error) {
      next(error);
    }
  }
);
server.delete(
  "/api/customers/:customer_id/reservations/:id",
  async (req, res, next) => {
    try {
      const { customer_id, id } = req.params;
      await destroyReservation({ customer_id, id });

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

server.use((err, req, res) => {
  res.status(err.status || 500).send({ err });
});

const init = async () => {
  await client.connect();

  await createTables();
  console.log("Tables created!");

  const [
    bobby,
    jim,
    norman,
    darian,
    havier,
    marge,
    frankie,
    maxerma,
    antonios,
    applebees,
    cheesecake,
    panda,
  ] = await Promise.all([
    createCustomer({ name: "Bobby Lee" }),
    createCustomer({ name: "Jim Bob" }),
    createCustomer({ name: "Norman Norville" }),
    createCustomer({ name: "Darian Rosewood" }),
    createCustomer({ name: "Havier Rosewood" }),
    createCustomer({ name: "Marge Vorn" }),
    createCustomer({ name: "Frankie Smith" }),
    createRestaurant({ name: "Max & Ermas" }),
    createRestaurant({ name: "Antonios" }),
    createRestaurant({ name: "Applebees" }),
    createRestaurant({ name: "Cheesecake Factory" }),
    createRestaurant({ name: "Panda Express" }),
  ]);

  console.log("Tables seeded!")

  const [] = await Promise.all([
    createReservation({
      date: "10/31/2025",
      party_count: 2,
      customer_id: darian.id,
      restaurant_id: maxerma.id,
    }),
    createReservation({
      date: "05/04/2023",
      party_count: 12,
      customer_id: frankie.id,
      restaurant_id: cheesecake.id,
    }),
    createReservation({
      date: "09/09/2029",
      party_count: 16,
      customer_id: marge.id,
      restaurant_id: applebees.id,
    }),
    createReservation({
      date: "06/17/2030",
      party_count: 4,
      customer_id: norman.id,
      restaurant_id: antonios.id,
    }),
    createReservation({
      date: "03/13/2053",
      party_count: 1,
      customer_id: jim.id,
      restaurant_id: panda.id,
    }),
  ]);

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
  });
};

init();