const slug = require("mongoose-slug-updater");
const mongoose = require("mongoose");
mongoose.plugin(slug);
const productSchema = new mongoose.Schema(
    {
        title: String,
        parent_id: {
            type: String,
            default: "",
        },
        description: String,
        brand_id: String,
        color: [
            {
                name_color: String,
                code_color: String,
            },
        ],
        features: {
            type: String,
            default: "false",
        },
        specifications: [
            {
                nameSpec: String,
                valueDefault: String,
            },
        ],
        features_spec: [
            {
                nameFeaturesSpec: String,
                valueDefault: String,
            },
        ],
        price: Number,
        discountPercentage: Number,
        stock: Number,
        thumbnail: String,
        listImage: [],
        slug: {
            type: String,
            slug: "title",
            unique: true,
            slugOn: { updateOne: false },
        },
        status: String,
        position: Number,
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
const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
