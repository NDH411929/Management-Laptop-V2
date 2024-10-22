const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({
    title: String,
    parent_id: {
        type: String,
        default: "",
    },
    brands: {
        type: Array,
        default: [],
    },
    features_spec: [
        {
            nameFeaturesSpec: String,
            valueDefault: {
                type: String,
                default: "",
            },
        },
    ],
    specifications: [
        {
            nameSpec: String,
            valueDefault: {
                type: String,
                default: "",
            },
        },
    ],
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: { type: String, slug: "title", unique: true },
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

const ProductCategory = mongoose.model(
    "ProductCategory",
    productCategorySchema,
    "products-category"
);

module.exports = ProductCategory;
