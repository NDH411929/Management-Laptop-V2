const Coupon = require("../../models/coupon.model");
const createTreeHelper = require("../../helpers/createTree.helper");

module.exports.coupons = async (req, res) => {
    res.render("client/pages/coupons/index", {
        title: "Coupons",
    });
};

module.exports.detail = async (req, res) => {
    const codeCoupon = req.params.codeCoupon;
    const coupon = await Coupon.findOne({
        codeCoupon: codeCoupon,
        deleted: false,
    });
    res.render("client/pages/coupons/detail", {
        title: "Coupons",
        coupon: coupon,
    });
};
