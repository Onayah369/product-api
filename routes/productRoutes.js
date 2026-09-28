import express from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({
            error: "Failed to create product",
            message: error.message,
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                error: "Product not found",
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                error: "Product not found",
            });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({
            error: "Failed to retrieve product",
            message: error.message,
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                error: "Product not found",
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!product) {
            return res.status(404).json({
                error: "Product not found",
            });
        }

        res.json(product);
    } catch (error) {
        res.status(400).json({
            error: "Failed to update product",
            message: error.message,
        });
    }
});

router.delete("/:id", async (req, res) =>{
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({
                error: "Product not found",
            });
        }

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                error: "Product not found",
            });
        }

        res.json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to delete product",
            message: error.message,
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            sortBy,
            page = 1,
            limit = 10,
        } = req.query;

        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (minPrice !==undefined) {
            filter.price = {
                ...filter.price,
                $gte: Number(minPrice),
            };
        }

        if (maxPrice !== undefined) {
            filter.price = {
                ...filter.price,
                $lte: Number(maxPrice),
            };
        }

        let sort = {};

        if (sortBy === "price_asc") {
            sort.price = 1;
        } else if (sortBy === "price_desc") {
            sort.price = -1;
        }

        const pageNumber = Math.max(Number(page) || 1, 1);
        const limitNumber = Math.max(Number(limit) || 10, 1);
        const skip = (pageNumber - 1) * limitNumber;

        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limitNumber);

        res.json(products);
    } catch (error) {
        res.status(500).json({
            error: "Failed to retrieve products",
            message: error.message,
        });
    }
});

export default router;