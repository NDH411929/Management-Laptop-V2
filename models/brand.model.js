const slug = require("mongoose-slug-updater");
const mongoose = require("mongoose");
mongoose.plugin(slug);
const brandSchema = new mongoose.Schema(
    {
        name: String,
        description: String,
        thumbnail: String,
        status: String,
        position: Number,
        imagesBrand: [],
        slug: {
            type: String,
            slug: "name",
            unique: true,
            slugOn: { updateOne: false },
        },
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
    },
    {
        timestamps: true,
    }
);
const Brand = mongoose.model("Brand", brandSchema, "brands");

module.exports = Brand;
