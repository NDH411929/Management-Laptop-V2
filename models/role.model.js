const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    title: String,
    permissions: {
        type: Array,
        default: [],
    },
    description: String,
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

const Role = mongoose.model("Role", roleSchema, "roles");

module.exports = Role;
