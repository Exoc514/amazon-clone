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
  const products = [
    {
      id: "1",
      name: "iPhone 15",
      price: "₹79,999",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      features: "128GB Storage, A16 Bionic Chip, 48MP Camera"
    },
    {
      id: "2",
      name: "Laptop",
      price: "₹55,999",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
      features: "16GB RAM, 512GB SSD, Intel i5 Processor"
    },
    {
      id: "3",
      name: "Headphone",
      price: "₹2,999",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      features: "Noise Cancellation, Bluetooth 5.0, 20hr Battery"
    },
    {
      id: "4",
      name: "Smart Watch",
      price: "₹4,999",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      features: "Heart Rate Monitor, GPS, Water Resistant"
    },
    {
      id: "5",
      name: "LED TV",
      price: "90,000",
      image: "https://cdn.gadgetbytenepal.com/wp-content/uploads/2024/12/LED-TV.jpg",
      features: "LED TV 36 inch, VERY GOOD"
    },
    {
      id: "6",
      name: "AC",
      price: "25000",
      image: "https://5.imimg.com/data5/SELLER/Default/2023/11/359514228/XI/OL/XD/3575132/window-air-conditioner-1000x1000.jpg",
      features: "VERY GOOD AC VOLTAS"
    },
    {
      id: "7",
      name: "Washing Machine",
      price: "75000",
      image: "https://www.lg.com/content/dam/channel/wcms/in/images/wm/fhp1412z9b/gallery/FHP1412Z9B-DZ-06.jpg/_jcr_content/renditions/thum-1600x1062.jpeg",
      features: "12Kg frontoad washing machine"
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

  // ===============================
  // Check order information
  // ===============================
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