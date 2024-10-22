const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");
module.exports.cart = async (req, res, next) => {
    const user = await User.findOne({
        tokenUser: req.cookies.tokenUser,
        status: "active",
        deleted: false,
    });
    if (user) {
        const cart = await Cart.findOne({
            _id: user.cartId,
        });
        if (cart) {
            res.locals.miniCart = cart;
        }
    }
    next();
};
