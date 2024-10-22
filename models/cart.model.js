const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
    account_id: String,
    products: [
        {
            product_id: String,
            color: String,
            quantity: Number,
        },
    ],
});

const Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;
