const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");
const ProductCategory = require("../../models/product-category.model");
const productHelper = require("../../helpers/product.helper");

module.exports.cart = async (req, res) => {
    const userCart = res.locals.miniCart;
    userCart.totalPriceNew = 0;
    userCart.totalPrice = 0;

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
        // // console.log(productId + " " + color + " " + quantity);
        // const test = await Cart.findOne({
        //     account_id: user.id,
        //     // "products.product_id": productId,
        //     "products.color": color,
        // });
        // console.log(test);

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

    res.redirect("back");
};
