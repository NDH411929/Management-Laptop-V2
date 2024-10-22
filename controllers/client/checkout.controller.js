const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

module.exports.checkout = async (req, res) => {
    const cartDetail = res.locals.miniCart;
    cartDetail.totalPrice = 0;

    for (const item of cartDetail.products) {
        const infoProduct = await Product.findOne({
            _id: item.product_id,
        });
        infoProduct.priceNew = (
            (infoProduct.price * (100 - infoProduct.discountPercentage)) /
            100
        ).toFixed(2);
        infoProduct.totalPrice = (infoProduct.priceNew * item.quantity).toFixed(
            2
        );
        item.infoProduct = infoProduct;
        cartDetail.totalPrice += parseFloat(infoProduct.totalPrice);
    }

    cartDetail.totalPrice = cartDetail.totalPrice.toFixed(2);

    res.render("client/pages/checkout/index", {
        title: "Checkout",
        cartDetail: cartDetail,
    });
};

module.exports.orderPost = async (req, res) => {
    // const cartId = req.cookies.cartId;
    const cartId = res.locals.miniCart.id;
    const userInfo = {
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        email: req.body.email,
    };

    const addressDelivery = {
        cityAddress: req.body.cityAddress,
        districAddress: req.body.districAddress,
        homeNumber: req.body.homeNumber,
    };

    const userNote = req.body.userNote;

    const cart = await Cart.findOne({
        _id: cartId,
    });

    const products = [];

    for (const item of cart.products) {
        const product = await Product.findOne({
            _id: item.product_id,
        });
        const stock = product.stock - item.quantity;
        if (stock < 0) {
            console.log("het san pham");
        } else {
            await Product.updateOne(
                { _id: item.product_id },
                {
                    stock: stock,
                }
            );
        }
        const objectProduct = {
            product_id: product.id,
            price: product.price,
            color: item.color,
            discountPercentage: product.discountPercentage,
            quantity: item.quantity,
        };
        products.push(objectProduct);
    }
    let objectOrder = {
        cart_id: cartId,
        userInfo: userInfo,
        addressDelivery: addressDelivery,
        products: products,
        userNote: userNote,
        createdAt: Date.now(),
    };

    const order = new Order(objectOrder);
    await order.save();
    await Cart.updateOne(
        {
            _id: order.cart_id,
        },
        {
            products: [],
        }
    );
    res.cookie("orderId", order.id);
    res.redirect(`/checkout/success`);
};

module.exports.checkoutSuccess = async (req, res) => {
    res.render("client/pages/checkout/success", {
        title: "Đặt hàng",
    });
};

module.exports.orderReview = async (req, res) => {
    const cartId = res.locals.miniCart.id;
    // const cart = await Cart.findOne({
    //     _id: cartId,
    // });
    const orders = await Order.find({
        cart_id: cartId,
    });

    for (const order of orders) {
        order.totalPrice = 0;
        for (const item of order.products) {
            const infoProduct = await Product.findOne({
                _id: item.product_id,
            });
            infoProduct.priceNew = (
                (infoProduct.price * (100 - infoProduct.discountPercentage)) /
                100
            ).toFixed(2);
            infoProduct.totalPrice = (
                infoProduct.priceNew * item.quantity
            ).toFixed(2);
            item.title = infoProduct.title;
            item.thumbnail = infoProduct.thumbnail;
            item.priceNew = infoProduct.priceNew;
            item.totalPrice = infoProduct.totalPrice;
            order.totalPrice += parseFloat(item.totalPrice);
        }
        order.totalPrice = order.totalPrice.toFixed(2);
    }

    res.render("client/pages/checkout/order-review", {
        title: "Xem lại đơn hàng",
        orders: orders,
    });
};
