const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const Coupon = require("../../models/coupon.model");
const ProductCategory = require("../../models/product-category.model");
const productHelper = require("../../helpers/product.helper");

module.exports.cart = async (req, res) => {
    const userCart = res.locals.miniCart;
    userCart.totalPriceNew = 0;
    userCart.totalPrice = 0;
    console.log(userCart);

    for (const item of userCart.products) {
        const detailProduct = await Product.findOne({
            _id: item.product_id,
        }).select(
            "thumbnail parent_id title price discountPercentage stock slug"
        );

        const titleCategory = await ProductCategory.findOne({
            _id: detailProduct.parent_id,
        }).select("title slug");
        detailProduct.priceNew = (
            (detailProduct.price * (100 - detailProduct.discountPercentage)) /
            100
        ).toFixed(2);

        if (titleCategory) {
            detailProduct.titleCategory = titleCategory.title;
            detailProduct.slugCategory = titleCategory.slug;
        }
        detailProduct.totalPrice = (
            detailProduct.price * item.quantity
        ).toFixed(2);

        detailProduct.totalPriceNew = (
            detailProduct.priceNew * item.quantity
        ).toFixed(2);

        userCart.totalPrice += parseFloat(detailProduct.totalPrice);
        userCart.totalPriceNew += parseFloat(detailProduct.totalPriceNew);

        item.detailProduct = detailProduct;
    }
    userCart.saleDeal = (userCart.totalPrice - userCart.totalPriceNew).toFixed(
        2
    );
    userCart.totalPrice = userCart.totalPrice.toFixed(2);
    userCart.totalPriceNew = userCart.totalPriceNew.toFixed(2);
    if (userCart.coupon_id) {
        const coupon = await Coupon.findOne({
            _id: userCart.coupon_id,
            deleted: false,
        });
        if (coupon) {
            if (coupon.status == "active") {
                const findCoupon = res.locals.infoUser.couponsId.find(
                    (item) => item.couponId == coupon.id
                );
                //Check coupon conditions
                if (coupon.minOrderValue > userCart.totalPriceNew) {
                    await Cart.updateOne(
                        {
                            _id: userCart.id,
                        },
                        { $unset: { coupon_id: userCart.coupon_id } }
                    );
                    res.redirect("back");
                }
                //Check coupon status
                if (findCoupon.couponStatus == "active") {
                    if (coupon.discountType == "percent") {
                        userCart.totalPriceCoupon = (
                            userCart.totalPriceNew *
                            (1 - coupon.discountValue / 100)
                        ).toFixed(2);
                    } else {
                        userCart.totalPriceCoupon = (
                            userCart.totalPriceNew - coupon.discountValue
                        ).toFixed(2);
                    }
                    userCart.saleCoupon = (
                        userCart.totalPriceNew - userCart.totalPriceCoupon
                    ).toFixed(2);
                    userCart.totalPriceNew = userCart.totalPriceCoupon;
                    userCart.saving = (
                        parseFloat(userCart.saleDeal) +
                        parseFloat(userCart.saleCoupon)
                    ).toFixed(2);
                }
            } else {
                await Cart.updateOne(
                    {
                        _id: userCart.id,
                    },
                    { $unset: { coupon_id: userCart.coupon_id } }
                );
            }
        }
    }
    //Format total price
    userCart.totalPriceNew =
        userCart.totalPriceNew < 0 ? 0 : userCart.totalPriceNew;

    res.render("client/pages/cart/index", {
        title: "Giỏ hàng",
        userCart: userCart,
    });
};

module.exports.addPost = async (req, res) => {
    const tokenUser = req.cookies.tokenUser;
    const user = await User.findOne({
        tokenUser: tokenUser,
    });
    if (user) {
        const productId = req.params.productId;
        const quantity = parseInt(req.body.quantity);
        const color = req.body.color;
        const getCart = await Cart.findOne({ account_id: user.id });
        if (getCart) {
            const existProductInCart = getCart.products.find(
                (item) => item.product_id == productId && item.color == color
            );
            if (existProductInCart) {
                const quantityUpdate = existProductInCart.quantity + quantity;

                await Cart.updateOne(
                    {
                        account_id: user.id,
                        "products.product_id": productId,
                    },
                    {
                        $set: { "products.$.quantity": quantityUpdate },
                    }
                );
                req.flash("success", "Thêm vào giỏ hàng thành công!");
            } else {
                let objectCart = {
                    product_id: productId,
                    quantity: quantity,
                    color: color,
                };
                await Cart.updateOne(
                    {
                        account_id: user.id,
                    },
                    {
                        $push: { products: objectCart },
                    }
                );
                req.flash("success", "Thêm vào giỏ hàng thành công!");
            }
        }
    }
    res.redirect("back");
};

module.exports.updateItem = async (req, res) => {
    const tokenUser = req.cookies.tokenUser;
    const user = await User.findOne({
        tokenUser: tokenUser,
    });

    if (user) {
        const productId = req.params.productId;
        const color = req.params.color;
        const quantity = parseInt(req.params.quantity);
        const getCart = await Cart.findOne({ account_id: user.id });
        let id = "";
        for (const item of getCart.products) {
            if (item.product_id == productId && item.color == color) {
                id = item.id;
            }
        }
        //Update quantity products in cart
        await Cart.updateOne(
            {
                account_id: user.id,
                "products._id": id,
                // "products.color": color,
            },
            {
                $set: {
                    "products.$.quantity": quantity,
                },
            }
        );
    }

    res.redirect("back");
};

module.exports.delete = async (req, res) => {
    const tokenUser = req.cookies.tokenUser;
    const user = await User.findOne({
        tokenUser: tokenUser,
    });
    if (user) {
        const productId = req.params.productId;
        const color = req.params.color;
        await Cart.updateOne(
            {
                account_id: user.id,
            },
            { $pull: { products: { product_id: productId, color: color } } }
        );
    }
    req.flash("success", "Xóa thành công!");
    res.redirect("back");
};

module.exports.applyVoucher = async (req, res) => {
    const tokenUser = req.cookies.tokenUser;
    const user = await User.findOne({
        tokenUser: tokenUser,
    });
    if (user) {
        const id = req.params.id;
        const userCart = res.locals.miniCart;
        userCart.totalPriceNew = 0;
        userCart.totalPrice = 0;
        for (const item of userCart.products) {
            const detailProduct = await Product.findOne({
                _id: item.product_id,
            }).select("price discountPercentage");
            detailProduct.priceNew = (
                (detailProduct.price *
                    (100 - detailProduct.discountPercentage)) /
                100
            ).toFixed(2);
            detailProduct.totalPrice = (
                detailProduct.price * item.quantity
            ).toFixed(2);

            detailProduct.totalPriceNew = (
                detailProduct.priceNew * item.quantity
            ).toFixed(2);

            userCart.totalPrice += parseFloat(detailProduct.totalPrice);
            userCart.totalPriceNew += parseFloat(detailProduct.totalPriceNew);

            item.detailProduct = detailProduct;
        }
        userCart.totalPriceNew = userCart.totalPriceNew.toFixed(2);
        const coupon = await Coupon.findOne({
            _id: id,
            deleted: false,
        });
        // Check coupon conditions before add coupon to cart
        if (coupon) {
            if (coupon.minOrderValue <= userCart.totalPriceNew) {
                await Cart.updateOne(
                    {
                        account_id: user.id,
                    },
                    { coupon_id: id }
                );
                req.flash("success", "Thêm mã giảm giá thành công!");
            } else {
                req.flash("error", "Đơn hàng của bạn chưa thỏa mãn điều kiện!");
            }
        } else {
            req.flash("error", "Không tìm thấy mã giảm giá!");
        }

        // End check coupon conditions
    }

    res.redirect("back");
};
