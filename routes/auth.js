

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// REGISTER
router.post("/register", async (req, res) => {
    try {
        console.log("REGISTER HIT");

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        await user.save();

        res.json({ message: "User saved in DB" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

//login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await
    User.findOne({email });

    if (!user) {
        return res.status(400).json({ message:"User not found"});
    }
    const isMatch = await
    bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.status(400).json({message:"Invalid password"});
    }
    const token = jwt.sign(
        { id: user.id},
        process.env.JWT_SECRET,
        { expiresIn: "1h"}
    );
    res.json({ message: "Login successful",token});
});

// middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "No token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

// protected route
router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user
    });
});

module.exports = router;
