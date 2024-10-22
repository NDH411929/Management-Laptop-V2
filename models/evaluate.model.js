const mongoose = require("mongoose");

const evaluateSchema = new mongoose.Schema(
    {
        product_id: String,
        rate: [
            {
                user_id: String,
                value: Number,
                description: String,
            },
        ],
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Evaluate = mongoose.model("Evaluate", evaluateSchema, "evaluates");

module.exports = Evaluate;
