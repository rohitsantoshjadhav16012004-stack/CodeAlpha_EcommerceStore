const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/product");
const User = require("./models/user");
const Order = require("./models/order");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 5000;

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/codealpha_store")
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });

app.use(express.json());
app.use(express.static("public"));

app.post("/api/products", async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();

        res.json({
            message: "Product added successfully!",
            product: product
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add product",
            error: error.message
        });
    }
});


app.get("/api/update-images", async (req, res) => {
    try {
        await Product.updateOne(
            { name: "Wireless Headphones" },
            { image: "/images/headphones.jpg" }
        );

        await Product.updateOne(
            { name: "Smart Watch" },
            { image: "/images/smartwatch.jpg" }
        );

        await Product.updateOne(
            { name: "Bluetooth Speaker" },
            { image: "/images/speaker.jpg" }
        );

        await Product.updateOne(
            { name: "Gaming Mouse" },
            { image: "/images/mouse.jpg" }
        );

        res.json({ message: "Product images updated successfully!" });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update images",
            error: error.message
        });
    }
});

app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find();

        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get products",
            error: error.message
        });
    }
});

app.get("/api/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get product",
            error: error.message
        });
    }
});

app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

const user = new User({
    name,
    email,
    password: hashedPassword
});

        await user.save();

        res.json({
            message: "Registration successful!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "User not found!"
            });
        }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

if (!isPasswordCorrect) {
    return res.status(401).json({
        message: "Incorrect password!"
    });
}

        res.json({
            message: "Login successful! 🎉"
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});

app.post("/api/orders", async (req, res) => {
    try {
        const { customerName, customerEmail, items, total } = req.body;

        const order = new Order({
            customerName,
            customerEmail,
            items,
            total
        });

        await order.save();

        res.json({
            message: "Order placed successfully! 🎉",
            order: order
        });

    } catch (error) {
        res.status(500).json({
            message: "Order failed",
            error: error.message
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});