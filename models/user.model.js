const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    cartId: String,
    avatar: {
        type: String,
        default: "",
    },
    sex: String,
    fullName: String,
    phoneNumber: String,
    birthDay: Date,
    email: String,
    address: {
        city: String,
        distric: String,
        homeNumber: String,
    },
    password: String,
    tokenUser: String,
    status: {
        type: String,
        default: "active",
    },
    createdAt: Date,
    updatedAt: Date,
    deleted: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
