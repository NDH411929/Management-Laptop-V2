const Coupon = require("../../models/coupon.model");
const createTreeHelper = require("../../helpers/createTree.helper");

module.exports.coupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({
            deleted: false,
            status: "active",
        });
        res.render("client/pages/coupons/index", {
            title: "Coupons",
            coupons: coupons,
        });
    } catch (error) {
        res.redirect("/");
    }
};

module.exports.detail = async (req, res) => {
    try {
        const codeCoupon = req.params.codeCoupon;
        const coupon = await Coupon.findOne({
            codeCoupon: codeCoupon,
            deleted: false,
        });
        res.render("client/pages/coupons/detail", {
            title: "Coupons",
            coupon: coupon,
        });
    } catch (error) {
        res.redirect("/");
    }
};
