const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const filterStatusHelper = require("../../helpers/filterStatus.helper");
const searchHelper = require("../../helpers/search.helper");
const paginationHelper = require("../../helpers/pagination.helper");
module.exports.binProducts = async (req, res) => {
    let find = {
        deleted: true,
    };

    //filterStatus
    const filterStatus = filterStatusHelper(req.query);
    if (req.query.status) {
        //req.query là trả ra các query trên url (?status="active") hoặc (?price=123)
        find.status = req.query.status;
    }
    //End filter status

    //Search
    const searchProducts = searchHelper(req.query);
    if (searchProducts.regex) {
        find.title = searchProducts.regex;
    }
    //End search

    //Pagination

    //Calculate Total Products
    const countProducts = await Product.countDocuments(find);

    const objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItem: 4,
        },
        req.query,
        countProducts
    );
    //End Pagination

    const products = await Product.find(find)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    for (const product of products) {
        const user = await Account.findOne({
            _id: product.deletedBy.account_id,
        }).select("-password");

        if (user) {
            product.deletedByFullName = user.fullName;
        }
    }

    //Phần render ra ngoài view
    res.render("admin/pages/bin-products/index", {
        title: "Product",
        products: products,
        filterStatus: filterStatus,
        keyword: searchProducts.keyword,
        pagination: objectPagination,
    });
};

module.exports.returnProducts = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({ _id: id }, { deleted: false });
    req.flash("success", `Khôi phục sản phẩm thành công!`);
    res.redirect("back");
};

module.exports.returnMulti = async (req, res) => {
    const type = req.body.type;
    const iDs = req.body.ids.split(", ");
    switch (type) {
        case "return-all":
            await Product.updateMany({ _id: { $in: iDs } }, { deleted: false });
            req.flash(
                "success",
                `Khôi phục ${iDs.length} sản phẩm thành công!`
            );
            break;
        case "delete-all":
            await Product.deleteMany({ _id: { $in: iDs } });
            req.flash("success", `Xóa ${iDs.length} sản phẩm thành công!`);
            break;
        default:
            break;
    }
    res.redirect("back");
};

module.exports.deleteProducts = async (req, res) => {
    const id = req.params.id;
    await Product.deleteOne({ _id: id });
    req.flash("success", `Xóa sản phẩm thành công!`);
    res.redirect("back");
};
