const Blog = require("../../models/blog.model");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const filterStatusHelper = require("../../helpers/filterStatus.helper");
const searchHelper = require("../../helpers/search.helper");
const paginationHelper = require("../../helpers/pagination.helper");
const createTreeHelper = require("../../helpers/createTree.helper");
const systemConfig = require("../../config/system");
const BlogCategory = require("../../models/blog-category.model");

module.exports.blogs = async (req, res) => {
    try {
        //Phần render ra ngoài view
        const findBlogs = {
            deleted: false,
        };

        //filterStatus
        const filterStatus = filterStatusHelper(req.query);
        if (req.query.status) {
            //req.query là trả ra các query trên url (?status="active") hoặc (?price=123)
            findBlogs.status = req.query.status;
        }
        //End filter status

        //Search
        const searchBlog = searchHelper(req.query);
        if (searchBlog.regex) {
            findBlogs.title = searchBlog.regex;
        }
        //End search

        const blogs = await Blog.find(findBlogs);

        for (const blog of blogs) {
            const user = await Account.findOne({
                _id: blog.createdBy.account_id,
            }).select("-password");

            const category = await BlogCategory.findOne({
                _id: blog.parent_id,
            });

            if (category) {
                blog.category = category.title;
            }

            const role = await Role.findOne({
                _id: user.role_id,
                deleted: false,
            }).select("title");

            if (user) {
                blog.createdByFullName = user.fullName;
                if (role) {
                    blog.roleUser = role.title;
                }
            }
        }

        res.render("admin/pages/blogs/index", {
            title: "Blogs",
            blogs: blogs,
            filterStatus: filterStatus,
            keyword: searchBlog.keyword,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.changeStatus = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("blogs_edit")) {
            const status = req.params.status;
            const id = req.params.id;
            //History update
            let updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            };
            await Blog.updateOne(
                { _id: id },
                {
                    status: status,
                    $push: {
                        updatedBy: updatedBy,
                    },
                }
            );
            req.flash("success", "Thay đổi trạng thái thành công!");
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.createBlog = async (req, res) => {
    try {
        //Get list categories
        const records = await BlogCategory.find({
            deleted: false,
        });
        const newRecords = createTreeHelper.tree(records);
        //End
        //Phần render ra ngoài view
        res.render("admin/pages/blogs/create", {
            title: "Blogs",
            records: newRecords,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.createBlogPost = async (req, res) => {
    try {
        //parent_id: String,
        if (res.locals.roleUser.permissions.includes("blogs_create")) {
            const exists = await Blog.findOne({
                title: req.body.title,
                deleted: false,
            });
            if (exists) {
                req.flash("error", "Tên bài viết đã tồn tại!");
                res.redirect("back");
                return;
            }
            if (req.body.position == "") {
                const count = await Blog.countDocuments({});
                req.body.position = count + 1;
            } else {
                req.body.position = parseInt(req.body.position);
            }
            let createdBy = {
                account_id: res.locals.user.id,
                createdAt: new Date(),
            };
            req.body.createdBy = createdBy;
            // if (req.body.parent_id != "") {
            //     const parentCategory = await ProductCategory.findOne({
            //         _id: req.body.parent_id,
            //         deleted: false,
            //     });
            //     req.body.specifications = parentCategory.specifications;
            //     req.body.features_spec = parentCategory.features_spec;
            //     req.body.brands = parentCategory.brands;
            // }
            const blog = new Blog(req.body);
            blog.save();
            req.flash("success", "Thêm bài viết thành công!");
            res.redirect("back");
        } else {
            res.send("404");
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.editBlog = async (req, res) => {
    try {
        const idBlog = req.params.idBlog;
        const blog = await Blog.findOne({
            _id: idBlog,
            deleted: false,
        });
        //Get list categories
        const records = await BlogCategory.find({
            deleted: false,
        });
        const newRecords = createTreeHelper.tree(records);
        res.render("admin/pages/blogs/edit", {
            title: "Edit Blog",
            blog: blog,
            records: newRecords,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.editBlogPatch = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("blogs_edit")) {
            const idBlog = req.params.idBlog;
            let updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            };
            await Blog.updateOne(
                { _id: idBlog },
                {
                    ...req.body,
                    $push: {
                        updatedBy: updatedBy,
                    },
                }
            );
            req.flash("success", "Cập nhật bài viết thành công");
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.deleteBlog = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("blogs_delete")) {
            const idBlog = req.params.idBlog;
            await Blog.updateOne(
                {
                    _id: idBlog,
                },
                {
                    deleted: true,
                }
            );
            req.flash("success", "Xóa bài viết thành công!");
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.detail = async (req, res) => {
    try {
        const idBlog = req.params.idBlog;
        const blog = await Blog.findOne(
            {
                _id: idBlog,
            },
            {
                deleted: false,
            }
        );
        if (blog.createdBy) {
            const user = await Account.findOne({
                _id: blog.createdBy.account_id,
            }).select("fullName");
            if (user) {
                blog.fullNameCreated = user.fullName;
            }
        }
        if (blog.updatedBy.length > 0) {
            const user = await Account.findOne({
                _id: blog.updatedBy[blog.updatedBy.length - 1].account_id,
            });
            if (user) {
                blog.fullNameUpdated = user.fullName;
            }
        }
        res.render("admin/pages/blogs/detail", {
            title: "Detail Blog",
            record: blog,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};
