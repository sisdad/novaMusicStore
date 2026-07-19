require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();


// Middleware
app.use(cors({
    origin: [
        "http://localhost:5173",
        process.env.FRONTEND_URL
    ],
    credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Serve uploaded files
app.use("/uploads", express.static("uploads"));


// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Music Demo API Running"
    });
});


// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/music", require("./routes/music"));
app.use("/api/barcode", require("./routes/barcode"));


// Start Server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});