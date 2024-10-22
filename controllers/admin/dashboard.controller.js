const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const ProductCategory = require("../../models/product-category.model");
const User = require("../../models/user.model");
module.exports.dashboard = async(req, res) => {
    const statistic = {
        categoryProduct: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0,
        },
    };
    //Get product category
    statistic.categoryProduct.total = await ProductCategory.countDocuments({});
    statistic.categoryProduct.active = await ProductCategory.countDocuments({
        status: "active",
    });
    statistic.categoryProduct.inactive = await ProductCategory.countDocuments({
        status: "inactive",
    });
    //Get product
    statistic.product.total = await Product.countDocuments({});
    statistic.product.active = await Product.countDocuments({
        status: "active",
    });
    statistic.product.inactive = await Product.countDocuments({
        status: "inactive",
    });
    //Get account
    statistic.account.total = await Account.countDocuments({});
    statistic.account.active = await Account.countDocuments({
        status: "active",
    });
    statistic.account.inactive = await Account.countDocuments({
        status: "inactive",
    });
    //Get user
    statistic.user.total = await User.countDocuments({});
    statistic.user.active = await User.countDocuments({
        status: "active",
    });
    statistic.user.inactive = await User.countDocuments({
        status: "inactive",
    });

    res.render("admin/pages/dashboard/index", {
        title: "Dashboard",
        statistic: statistic,
    });
};