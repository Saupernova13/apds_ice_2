import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";

const router = express.Router();
var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

// signup
router.post("/signup", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let newDocument = {
            name: req.body.name,
            password: hashedPassword
        };
        let collection = await db.collection("users");
        let result = await collection.insertOne(newDocument);
        res.status(201).send(result);
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Signup failed" });
    }
});

// login
router.post("/login", bruteforce.prevent, async (req, res) => {
    const { name, password } = req.body;

    try {
        const collection = await db.collection("users");
        const user = await collection.findOne({ name });

        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Authentication failed" });
        } else {
            // Authentication successful
            const token = jwt.sign(
              { username: req.body.name },
              "this_secret_should_be_longer_than_it_is",
              { expiresIn: "1h" }
            );
            res.status(200).json({
                message: "Authentication successful",
                token: token,
                name: req.body.name
            });
            console.log("your new token is", token);
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});

export default router;