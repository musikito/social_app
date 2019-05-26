const express = require("express");
const connectDB = require("./config/db");
const app = express();
const PORT = process.env.PORT || 5000;

//connect to the DB
connectDB();

app.get("/", (req, res) => res.send("APP running"));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
