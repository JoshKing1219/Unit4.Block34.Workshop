const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  fetchCustomers,
  fetchRestaurants,
} = require("./db");

const init = async () => {
  await client.connect();

  await createTables();
  console.log("Tables created!");

  const [
    bobby,
    jim,
    norman,
    darian,
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

  console.log("Tables seeded!");

  const customers = await fetchCustomers();
  console.log("Customers", customers);

  const restaurants = await fetchRestaurants();
  console.log("Restaurants", restaurants);

  const [reserv1, reserv2, reserv3, reserv4, reserv5] = await Promise.all([
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

  console.log("Darian Reserv", reserv1);
  console.log("Frankie Reserv", reserv2);
  console.log("Marge Reserv", reserv3);
  console.log("Norman Reserv", reserv4);
  console.log("Jim Reserv", reserv5);
};

init();
