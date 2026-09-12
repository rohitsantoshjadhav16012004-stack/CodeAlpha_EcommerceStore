const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },

    customerEmail: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    items: {
        type: Array,
        required: true
    },

    total: {
        type: Number,
        required: true
    },

    orderDate: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;