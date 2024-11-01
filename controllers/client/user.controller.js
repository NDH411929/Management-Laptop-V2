const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const Coupon = require("../../models/coupon.model");
const ForgotPassword = require("../../models/forgot-password.model");
const sendMailHelper = require("../../helpers/sendMail.helper");
const generateHelper = require("../../helpers/generate.helper");
const md5 = require("md5");

module.exports.register = async (req, res) => {
    res.render("client/pages/users/register", {
        title: "Register",
    });
};

module.exports.registerPost = async (req, res) => {
    // console.log(req.body);
    const emailExist = await User.findOne({
        email: req.body.email,
        status: "active",
        deleted: false,
    });
    if (emailExist) {
        req.flash("error", "Email đã tồn tại!");
        res.redirect("back");
        return;
    }
    const userInfo = {
        fullName: req.body.fullName,
        email: req.body.email,
        password: md5(req.body.password),
        tokenUser: generateHelper.generateRandomString(30),
    };

    const user = new User(userInfo);
    await user.save();

    res.cookie("tokenUser", user.tokenUser);

    if (!user.cartId) {
        const cart = new Cart({ account_id: user.id });
        await cart.save();
        await User.updateOne(
            {
                _id: cart.account_id,
            },
            {
                cartId: cart.id,
                createdAt: Date.now(),
            }
        );
    }
    res.redirect("/");
};

module.exports.login = async (req, res) => {
    res.render("client/pages/users/login", {
        title: "Login",
    });
};

module.exports.loginPost = async (req, res) => {
    const password = req.body.password;
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false,
    });
    if (!user) {
        req.flash("error", "Email đã tồn tại! Vui lòng đăng nhập lại!");
        res.redirect("back");
        return;
    }
    if (user.password != md5(password)) {
        req.flash("error", "Sai mật khẩu! Vui lòng đăng nhập lại!");
        res.redirect("back");
        return;
    }
    if (user.status == "inactive") {
        req.flash("error", "Tài khoản đã bị khóa!");
        res.redirect("back");
        return;
    }
    res.cookie("tokenUser", user.tokenUser);

    if (!user.cartId) {
        const cart = new Cart({ account_id: user.id });
        await cart.save();
        await User.updateOne(
            {
                _id: cart.account_id,
            },
            { cartId: cart.id }
        );
    }

    res.redirect("/");
};

module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser", req.cookies.tokenUser);
    res.clearCookie("cartId", req.cookies.cartId);
    res.redirect("/");
};

module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/users/forgot-password", {
        title: "Forgot Password",
    });
};

module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;
    const emailExist = await User.findOne({
        email: email,
        deleted: false,
    });
    if (!emailExist) {
        console.log("khong tim thay email");
        req.flash("error", "Khong tim thay email");
        res.redirect("back");
        return;
    }

    const codeOtp = generateHelper.generateRandomNumber(4);

    const objectForgot = {
        email: email,
        otp: codeOtp,
        expireAt: Date.now(),
    };
    const forgotPassword = new ForgotPassword(objectForgot);
    await forgotPassword.save();

    const subject = "Mã OTP lấy lại mật khẩu";
    const html = `Mã OTP của bạn là <b>${codeOtp}</b>. Vui lòng không chia sẻ mã OTP cho bất kỳ ai. Thời hạn sử dụng mã là 3 phút.`;

    sendMailHelper.sendMail(email, subject, html);

    res.redirect(`/user/password/otp/?email=${email}`);
};

module.exports.otp = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/users/otp-password", {
        title: "Forgot Password",
        email: email,
    });
};

module.exports.otpPost = async (req, res) => {
    const codeOtp = req.body.otp;
    const email = req.body.email;
    const otpExist = await ForgotPassword.findOne({
        email: email,
        otp: codeOtp,
    });
    if (!otpExist) {
        console.log("ma otp sai");
        req.flash("error", "Ma OTP sai");
        res.redirect("back");
        return;
    }
    const user = await User.findOne({
        email: email,
    });

    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/user/password/reset");
};

module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/users/reset-password", {
        title: "Reset Password",
    });
};

module.exports.resetPasswordPost = async (req, res) => {
    const tokenUser = req.cookies.tokenUser;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password != confirmPassword) {
        console.log("MK k khop");
        req.flash("error", "Xác nhận mật khẩu không khớp!");
        res.redirect("back");
        return;
    }

    await User.updateOne(
        {
            tokenUser: tokenUser,
        },
        {
            password: md5(password),
        }
    );

    console.log("doi thanh cong");
    req.flash("success", "Đổi mật khẩu thành công!");
    res.redirect("/");
};

module.exports.infoUser = async (req, res) => {
    const tokenUser = req.cookies.tokenUser;
    const cartId = res.locals.miniCart.id;
    const user = await User.findOne({
        tokenUser: tokenUser,
        status: "active",
        deleted: false,
    });

    const orders = await Order.find({
        cart_id: cartId,
    });

    for (const order of orders) {
        order.totalPrice = 0;
        order.discount = 0;
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
        if (order.coupon != "") {
            const coupon = await Coupon.findOne({
                _id: order.coupon,
            }).select("discountType discountValue");
            if (coupon.discountType == "fixed") {
                order.totalPrice = order.totalPrice - coupon.discountValue;
                order.discount = coupon.discountValue;
            } else {
                order.discount =
                    order.totalPrice -
                    order.totalPrice * (1 - coupon.discountValue / 100);
                order.totalPrice =
                    order.totalPrice * (1 - coupon.discountValue / 100);
            }
        }
        order.discount = order.discount.toFixed(0);
        order.totalPrice = order.totalPrice.toFixed(2);
    }
    res.render("client/pages/users/info", {
        title: "info",
        user: user,
        orders: orders,
    });
};

module.exports.editInfoUser = async (req, res) => {
    const id = req.params.id;
    // const cityAddress = req.body.cityAddress;
    // const districAddress = req.body.districAddress;
    // const homeNumber = req.body.homeNumber;
    // const address = homeNumber + "-" + districAddress + "-" + cityAddress;
    await User.updateOne(
        {
            _id: id,
        },
        req.body
    );
    res.redirect("back");
};

module.exports.editInfoAddress = async (req, res) => {
    const id = req.params.id;
    // const cityAddress = req.body.cityAddress;
    // const districAddress = req.body.districAddress;
    // const homeNumber = req.body.homeNumber;
    // const address = homeNumber + "-" + districAddress + "-" + cityAddress;
    await User.updateOne(
        {
            _id: id,
        },
        {
            address: req.body,
        }
    );
    res.redirect("back");
};

module.exports.voucher = async (req, res) => {
    const id = req.params.id;
    const user = await User.findOne({
        tokenUser: req.cookies.tokenUser,
        status: "active",
        deleted: false,
    });
    const coupon = await Coupon.findOne({
        _id: id,
        deleted: false,
    });
    if (user.couponsId.includes(id)) {
        console.log("da ton tai");
    } else {
        let usageLimit = coupon.usageLimit - 1;
        if (usageLimit >= 0) {
            await User.updateOne(
                {
                    tokenUser: req.cookies.tokenUser,
                    status: "active",
                    deleted: false,
                },
                {
                    $push: {
                        couponsId: {
                            couponId: id,
                        },
                    },
                }
            );
            await Coupon.updateOne(
                {
                    _id: id,
                },
                {
                    usageLimit: usageLimit,
                }
            );
        } else {
            console.log("Da het luot su dung");
        }
    }
    res.redirect("back");
};
