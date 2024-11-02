const Blog = require("../../models/blog.model");
const BlogCategory = require("../../models/blog-category.model");
const paginationHelper = require("../../helpers/pagination.helper");
const createTreeHelper = require("../../helpers/createTree.helper");
const filterStatusHelper = require("../../helpers/filterStatus.helper");
const searchHelper = require("../../helpers/search.helper");
const systemConfig = require("../../config/system");

module.exports.blogsCategory = async (req, res) => {
    try {
        let findListCategory = {
            deleted: false,
        };

        //filterStatus
        const filterStatus = filterStatusHelper(req.query);
        if (req.query.status) {
            //req.query là trả ra các query trên url (?status="active") hoặc (?price=123)
            findListCategory.status = req.query.status;
        }
        //End filter status

        //Search
        const searchBlogsCategory = searchHelper(req.query);
        if (searchBlogsCategory.regex) {
            findListCategory.title = searchBlogsCategory.regex;
        }
        //End search

        const records = await BlogCategory.find(findListCategory);
        const newRecords = createTreeHelper.tree(records);
        newRecords.sort((a, b) => {
            if (a.position > b.position) {
                return 1;
            } else {
                return -1;
            }
        });
        //Phần render ra ngoài view
        res.render("admin/pages/blogs-category/index", {
            title: "Danh mục blogs",
            records: newRecords,
            filterStatus: filterStatus,
            keyword: searchBlogsCategory.keyword,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.create = async (req, res) => {
    try {
        let findListCategory = {
            deleted: false,
        };

        const records = await BlogCategory.find(findListCategory);
        const newRecords = createTreeHelper.tree(records);
        res.render("admin/pages/blogs-category/create", {
            title: "Category Blogs",
            records: newRecords,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.createPost = async (req, res) => {
    try {
        if (req.body.position == "") {
            const count = await BlogCategory.countDocuments({
                deleted: false,
            });
            req.body.position = count + 1;
        } else {
            req.body.position = parseInt(req.body.position);
        }
        const blogCategoy = new BlogCategory(req.body);
        await blogCategoy.save();
        req.flash("success", "Thêm danh mục thành công!");
        res.redirect("back");
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const records = await BlogCategory.find({
            deleted: false,
        });

        const newRecords = createTreeHelper.tree(records);

        const dataBlogCategory = await BlogCategory.findOne({
            _id: id,
            deleted: false,
        });

        res.render("admin/pages/blogs-category/edit", {
            title: "Edit Category Blogs",
            records: newRecords,
            data: dataBlogCategory,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        await BlogCategory.updateOne(
            {
                _id: id,
            },
            {
                ...req.body,
            }
        );
        req.flash("success", "Edit blog thành công!");
        res.redirect("back");
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await BlogCategory.updateOne(
            {
                _id: id,
            },
            {
                deleted: true,
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date(),
                },
            }
        );
        req.flash("success", "Xóa thành công!");
        res.redirect("back");
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};
