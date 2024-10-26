const BlogCategory = require("../../models/blog-category.model");
const Account = require("../../models/account.model");
const Blog = require("../../models/blog.model");
const createTreeHelper = require("../../helpers/createTree.helper");

module.exports.blogs = async (req, res) => {
    const blogs = await Blog.find({
        deleted: false,
        status: "active",
    }).sort({ "createdBy.createdAt": "desc" });

    for (const item of blogs) {
        const user = await Account.findOne({
            _id: item.createdBy.account_id,
        }).select("-password");

        if (user) {
            item.createdAt = item.createdBy.createdAt;
            item.createdByFullName = user.fullName;
        }
    }

    //Get 4 blogs new
    const featureBlogs = await Blog.find({
        deleted: false,
        features: "true",
        status: "active",
    })
        .sort({ position: "asc" })
        .limit(4);
    for (const item of featureBlogs) {
        const user = await Account.findOne({
            _id: item.createdBy.account_id,
        }).select("-password");

        if (user) {
            item.createdAt = item.createdBy.createdAt;
            item.createdByFullName = user.fullName;
        }
    }
    // const featureBlogs = blogs.slice(0, 4);

    const blogCategory = await BlogCategory.find({
        status: "active",
        deleted: false,
    });

    const newBlogCategory = createTreeHelper.tree(blogCategory);

    res.render("client/pages/blogs/index", {
        title: "Blogs",
        blogs: blogs,
        featureBlogs: featureBlogs,
        newBlogCategory: newBlogCategory,
    });
};

module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
    const blog = await Blog.findOne({
        slug: slug,
        deleted: false,
        status: "active",
    });
    const user = await Account.findOne({
        _id: blog.createdBy.account_id,
    }).select("-password");

    if (user) {
        blog.createdAt = blog.createdBy.createdAt;
        blog.createdByFullName = user.fullName;
    }
    res.render("client/pages/blogs/detail", {
        title: "Detail",
        blog: blog,
    });
};
