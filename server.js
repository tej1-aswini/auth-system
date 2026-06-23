require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use((req, res, next) => {
    console.log("HIT:", req.method, req.url);
    next();
});
app.use(express.json());

const authRoutes = require("./routes/auth");
console.log(authRoutes);
app.use("/api", authRoutes);

app.get("/", (req, res) => {
    res.send("Authentication API is running...");
});

mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});