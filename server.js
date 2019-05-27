const express = require("express");
const connectDB = require("./config/db");
const app = express();
const PORT = process.env.PORT || 5000;

//connect to the DB
connectDB();

//Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("APP running"));

//define the routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
