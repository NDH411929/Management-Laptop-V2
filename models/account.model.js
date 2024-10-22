const mongoose = require("mongoose");
const generate = require("../helpers/generate.helper");
const accountSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: generate.generateRandomString(30),
    },
    phoneNumber: String,
    avatar: String,
    role_id: String,
    status: String,
    createdBy: {
        account_id: String,
        createdAt: Date,
    },
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date,
        },
    ],
    deletedBy: {
        account_id: String,
        deletedAt: Date,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
});

const Account = mongoose.model("Account", accountSchema, "account");

module.exports = Account;
