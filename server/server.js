require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

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

  ssl: {
    rejectUnauthorized: false
  },

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
  const products = [
    {
      id: 1,
      name: "iPhone 15",
      price: "₹69999",
      image: "https://via.placeholder.com/250",
      features: "Apple iPhone with powerful performance and great camera"
    },
    {
      id: 2,
      name: "Samsung Galaxy S24",
      price: "₹64999",
      image: "https://via.placeholder.com/250",
      features: "Samsung smartphone with excellent display and camera"
    },
    {
      id: 3,
      name: "OnePlus 12",
      price: "₹59999",
      image: "https://via.placeholder.com/250",
      features: "Fast Android phone with powerful processor"
    },
    {
      id: 4,
      name: "HP Laptop",
      price: "₹54999",
      image: "https://via.placeholder.com/250",
      features: "Powerful laptop for work, study and entertainment"
    },
    {
      id: 5,
      name: "Sony Headphones",
      price: "₹9999",
      image: "https://via.placeholder.com/250",
      features: "Wireless headphones with high quality sound"
    },
    {
      id: 6,
      name: "Samsung Smart TV",
      price: "₹45999",
      image: "https://via.placeholder.com/250",
      features: "4K Smart TV with vivid picture quality"
    },
    {
      id: 7,
      name: "LG Air Conditioner",
      price: "₹39999",
      image: "https://via.placeholder.com/250",
      features: "Energy efficient air conditioner with powerful cooling"
    },
    {
      id: 8,
      name: "LG Washing Machine",
      price: "₹28999",
      image: "https://via.placeholder.com/250",
      features: "Fully automatic washing machine with multiple wash modes"
    },
    {
      id: 9,
      name: "Apple Watch",
      price: "₹42999",
      image: "https://via.placeholder.com/250",
      features: "Smart watch with fitness and health tracking"
    }
  ];

  res.json(products);
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