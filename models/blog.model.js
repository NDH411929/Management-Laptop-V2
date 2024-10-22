const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const blogSchema = new mongoose.Schema({
    title: String,
    parent_id: String,
    content: String,
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

const Blog = mongoose.model("Blog", blogSchema, "blogs");

module.exports = Blog;
