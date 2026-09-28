import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connection.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

connectDB();

app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Zenith Product API is running",
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});