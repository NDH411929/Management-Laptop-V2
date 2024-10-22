const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    // user_id: String,
    cart_id: String,
    status: {
        type: String,
        default: "initial",
    },
    statusDelivery: {
        type: String,
        default: "processing",
    },
    userInfo: {
        fullName: String,
        phoneNumber: String,
        address: String,
        email: String,
    },
    addressDelivery: {
        cityAddress: String,
        districAddress: String,
        homeNumber: String,
    },
    userNote: String,
    products: [
        {
            product_id: String,
            price: Number,
            discountPercentage: Number,
            quantity: Number,
            color: String,
        },
    ],
    createdAt: Date,
    deleted: {
        type: String,
        default: "false",
    },
});

const Oder = mongoose.model("Oder", orderSchema, "orders");

module.exports = Oder;
