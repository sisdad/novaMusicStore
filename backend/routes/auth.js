const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

//
// REGISTER
//
router.post("/register", async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const [existing] = await db.query(
            "SELECT id FROM users WHERE email=?",
            [email]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO users(full_name,email,password)
             VALUES(?,?,?)`,
            [full_name, email, hashedPassword]
        );

        res.json({
            success: true,
            message: "Registration successful"
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

//
// LOGIN
//
router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const [rows] = await db.query(
            "SELECT * FROM users WHERE email=?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid Email"
            });
        }

        const user = rows[0];

        const match = await bcrypt.compare(
            password,
            user.password
        );

        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({

    success:true,

    token,

    user:{

        id:user.id,

        full_name:user.full_name,

        email:user.email,

        role:user.role

    }

});

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

});

module.exports = router;