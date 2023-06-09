const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config({ path: "./config.env" });

// cors setup

// IMPORT ALL ROUTER
const userRouter = require("./routers/userRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "127.0.0.1:3000",
      "https://crm-frontend-test-rouge.vercel.app",
    ],

    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);

app.all("/", (req, res) => {
  res.send("hello world");
});

const PORT = process.env.PORT || 8000;

// Database connection
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB).then(() => {
  console.log("Database connection successfully!");
});

app.listen(PORT, () => {
  console.log("server running at port ", PORT);
});
