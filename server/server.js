require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// MySQL connection
// ===============================
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // Aiven requires SSL
  ssl: {
    rejectUnauthorized: false
  },

  // Give the database enough time to connect
  connectTimeout: 20000
});

// ===============================
// Connect to MySQL
// ===============================
db.connect((err) => {
  if (err) {
    console.log("Database connection failed:");
    console.log(err);
  } else {
    console.log("Connected to MySQL!");
  }
});

// ===============================
// Home route
// ===============================
app.get("/", (req, res) => {
  res.send("Phone Store Backend is running!");
});

// ===============================
// Test route
// ===============================
app.get("/test", (req, res) => {
  res.json({
    message: "Node is receiving requests!"
  });
});

// ===============================
// Products
// ===============================
app.get("/products", (req, res) => {
  const productFile = path.join(
    __dirname,
    "..",
    "public",
    "product.json"
  );

  fs.readFile(productFile, "utf8", (error, data) => {
    if (error) {
      console.log("PRODUCT FILE ERROR:");
      console.log(error);

      return res.status(500).json({
        message: "Products could not be loaded"
      });
    }

    try {
      const products = JSON.parse(data);

      res.json(products);
    } catch (parseError) {
      console.log("PRODUCT JSON ERROR:");
      console.log(parseError);

      return res.status(500).json({
        message: "Product data is invalid"
      });
    }
  });
});

// ===============================
// Place Order
// ===============================
app.post("/orders", (req, res) => {
  console.log("=================================");
  console.log("ORDER REQUEST RECEIVED");
  console.log(req.body);
  console.log("=================================");

  const {
    name,
    email,
    phone,
    address,
    total
  } = req.body;

  // Check order information
  if (
    !name ||
    !email ||
    !phone ||
    !address ||
    total === undefined
  ) {
    return res.status(400).json({
      message: "Some order information is missing"
    });
  }

  // ===============================
  // Save customer
  // ===============================
  const customerSql = `
    INSERT INTO customers
    (name, email, phone, address)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    customerSql,
    [name, email, phone, address],
    (customerError, customerResult) => {

      if (customerError) {
        console.log("CUSTOMER DATABASE ERROR:");
        console.log(customerError);

        return res.status(500).json({
          message: "Customer could not be saved"
        });
      }

      console.log("Customer saved successfully!");

      const customerId = customerResult.insertId;

      // ===============================
      // Save order
      // ===============================
      const orderSql = `
        INSERT INTO orders
        (customer_id, total_amount)
        VALUES (?, ?)
      `;

      db.query(
        orderSql,
        [customerId, total],
        (orderError, orderResult) => {

          if (orderError) {
            console.log("ORDER DATABASE ERROR:");
            console.log(orderError);

            return res.status(500).json({
              message: "Order could not be saved"
            });
          }

          console.log("Order saved successfully!");
          console.log("Order ID:", orderResult.insertId);

          res.json({
            message: "Order saved successfully",
            orderId: orderResult.insertId
          });
        }
      );
    }
  );
});

// ===============================
// Start server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("---------------------------------");
  console.log("Server running on port " + PORT);
  console.log("---------------------------------");
});