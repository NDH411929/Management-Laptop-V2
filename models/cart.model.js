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
    coupon_id: String,
    // couponStatus: String,
});

const Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;
