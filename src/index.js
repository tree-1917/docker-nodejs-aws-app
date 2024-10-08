// =================== //
// === Node.js App === //
// =================== //

// == Dependencies ==
const express = require("express");
const redis = require("redis");
const { Client } = require("pg"); // Updated PostgreSQL import

// == Connect to PostgreSQL ==
const pgClient = new Client({
  host: "postgres", // Make sure this matches the Docker service name
  port: 5432,
  user: "root", // Ensure this user exists in your PostgreSQL setup
  password: "example", // Ensure the password matches the PostgreSQL setup
});

// Connect to PostgreSQL and log the response
pgClient
  .connect()
  .then(async () => {
    const res = await pgClient.query("SELECT $1::text as message", [
      "Hello PostgreSQL!",
    ]);
    console.log("PostgreSQL says:", res.rows[0].message); // "Hello PostgreSQL!"
  })
  .catch((err) => {
    console.error("PostgreSQL connection error:", err);
  });

// == Connect to Redis ==
const redisClient = redis.createClient({
  socket: {
    host: "redis", // Redis service name in Docker
    port: 6379, // Redis default port
  },
  password: "example", // Password as configured in Redis setup
});

// On connect
redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err) => {
    console.error("Redis connection error:", err);
  });

// Init Express app
const PORT = process.env.PORT || 4002;
const app = express(); // Initialize the Express app

// Define routes
app.get("/", (req, res) => {
  res.send("<h1>Hello World from Node.js! <mark>Welcome Man</mark></h1>");
});

// Run server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Close PostgreSQL and Redis clients on app termination
process.on("SIGINT", async () => {
  await pgClient.end();
  await redisClient.disconnect();
  console.log("PostgreSQL and Redis clients disconnected");
  process.exit(0);
});
