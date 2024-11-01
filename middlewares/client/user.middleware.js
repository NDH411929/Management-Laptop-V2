const User = require("../../models/user.model");
const Coupon = require("../../models/coupon.model");
module.exports.user = async (req, res, next) => {
    if (req.cookies.tokenUser) {
        const infoUser = await User.findOne({
            tokenUser: req.cookies.tokenUser,
            deleted: false,
        });
        let coupons = [];
        for (const item of infoUser.couponsId) {
            const coupon = await Coupon.findOne({
                _id: item.couponId,
                deleted: false,
            });
            coupon.couponStatus = item.couponStatus;
            coupons.push(coupon);
        }
        infoUser.coupons = coupons;
        res.locals.infoUser = infoUser;
    }
    next();
};
