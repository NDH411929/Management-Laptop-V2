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
    try {
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
        req.flash("success", "Đăng nhập thành công!");
        res.redirect("/");
    } catch (error) {
        res.redirect("/");
    }
};

module.exports.login = async (req, res) => {
    res.render("client/pages/users/login", {
        title: "Login",
    });
};

module.exports.loginPost = async (req, res) => {
    try {
        const password = req.body.password;
        const email = req.body.email;
        const user = await User.findOne({
            email: email,
            deleted: false,
        });
        if (!user) {
            req.flash("error", "Sai email hoặc mật khẩu!");
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
        req.flash("success", "Đăng nhập thành công!");
        res.redirect("/");
    } catch (error) {
        res.redirect("/");
    }
};

module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser", req.cookies.tokenUser);
    res.clearCookie("cartId", req.cookies.cartId);
    req.flash("success", "Đăng xuất thành công!");
    res.redirect("/");
};

module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/users/forgot-password", {
        title: "Forgot Password",
    });
};

module.exports.forgotPasswordPost = async (req, res) => {
    try {
        const email = req.body.email;
        const emailExist = await User.findOne({
            email: email,
            deleted: false,
        });
        if (!emailExist) {
            req.flash("error", "Không tìm thấy email!");
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
        req.flash("success", "Hãy kiểm tra hòm thư của bạn!");
        res.redirect(`/user/password/otp/?email=${email}`);
    } catch (error) {
        res.redirect(`/`);
    }
};

module.exports.otp = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/users/otp-password", {
        title: "Forgot Password",
        email: email,
    });
};

module.exports.otpPost = async (req, res) => {
    try {
        const codeOtp = req.body.otp;
        const email = req.body.email;
        const otpExist = await ForgotPassword.findOne({
            email: email,
            otp: codeOtp,
        });
        if (!otpExist) {
            req.flash("error", "Mã OTP không khớp!");
            res.redirect("back");
            return;
        }
        const user = await User.findOne({
            email: email,
        });

        res.cookie("tokenUser", user.tokenUser);
        req.flash("success", "Khôi phục tài khoản thành công!");
        res.redirect("/user/password/reset");
    } catch (error) {
        res.redirect("/");
    }
};

module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/users/reset-password", {
        title: "Reset Password",
    });
};

module.exports.resetPasswordPost = async (req, res) => {
    try {
        const tokenUser = req.cookies.tokenUser;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        if (password != confirmPassword) {
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

        req.flash("success", "Đổi mật khẩu thành công!");
        res.redirect("/");
    } catch (error) {
        res.redirect("/");
    }
};

module.exports.infoUser = async (req, res) => {
    try {
        const tokenUser = req.cookies.tokenUser;
        const cartId = res.locals.miniCart.id;
        const user = await User.findOne({
            tokenUser: tokenUser,
            status: "active",
            deleted: false,
        });

        const orders = await Order.find({
            cart_id: cartId,
        }).sort({ createdAt: "desc" });

        for (const order of orders) {
            order.totalPrice = 0;
            order.discount = 0;
            for (const item of order.products) {
                const infoProduct = await Product.findOne({
                    _id: item.product_id,
                });
                infoProduct.priceNew = (
                    (infoProduct.price *
                        (100 - infoProduct.discountPercentage)) /
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
                if (coupon) {
                    if (coupon.discountType == "fixed") {
                        order.totalPrice =
                            order.totalPrice - coupon.discountValue;
                        order.discount = coupon.discountValue;
                    } else {
                        order.discount =
                            order.totalPrice -
                            order.totalPrice * (1 - coupon.discountValue / 100);
                        order.totalPrice =
                            order.totalPrice * (1 - coupon.discountValue / 100);
                    }
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
    } catch (error) {
        res.redirect("/");
    }
};

module.exports.editInfoUser = async (req, res) => {
    try {
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
        req.flash("success", "Cập nhật thành công!");
        res.redirect("back");
    } catch (error) {
        res.redirect("/");
    }
};

module.exports.editInfoAddress = async (req, res) => {
    try {
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
        req.flash("success", "Cập nhật thành công!");
        res.redirect("back");
    } catch (error) {
        res.redirect("/");
    }
};

module.exports.voucher = async (req, res) => {
    try {
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
            req.flash("error", "Bạn đã lưu mã giảm giá này rồi!");
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
                req.flash("success", "Mã giảm giá đã hết lượt sử dụng!");
            }
            req.flash("success", "Lưu mã giảm giá thành công!");
        }

        res.redirect("back");
    } catch (error) {
        res.redirect("/");
    }
};

module.exports.myCoupons = async (req, res) => {
    res.render("client/pages/users/my-coupons.pug", {
        title: "My Coupons",
        coupons: res.locals.infoUser.coupons,
    });
};

module.exports.myOrders = async (req, res) => {
    try {
        const cartId = res.locals.miniCart.id;
        // const cart = await Cart.findOne({
        //     _id: cartId,
        // });
        const orders = await Order.find({
            cart_id: cartId,
        }).sort({ createdAt: "desc" });

        for (const order of orders) {
            order.totalPrice = 0;
            order.discount = 0;
            for (const item of order.products) {
                const infoProduct = await Product.findOne({
                    _id: item.product_id,
                });
                item.priceNew = (
                    (item.price * (100 - item.discountPercentage)) /
                    100
                ).toFixed(2);
                item.totalPrice = (item.priceNew * item.quantity).toFixed(2);
                item.title = infoProduct.title;
                item.thumbnail = infoProduct.thumbnail;
                order.totalPrice += parseFloat(item.totalPrice);
            }
            if (order.coupon != "") {
                const coupon = await Coupon.findOne({
                    _id: order.coupon,
                }).select("discountType discountValue");
                if (coupon) {
                    if (coupon.discountType == "fixed") {
                        order.totalPrice =
                            order.totalPrice - coupon.discountValue;
                        order.discount = coupon.discountValue;
                    } else {
                        order.discount =
                            order.totalPrice -
                            order.totalPrice * (1 - coupon.discountValue / 100);
                        order.totalPrice =
                            order.totalPrice * (1 - coupon.discountValue / 100);
                    }
                }
            }
            order.discount = order.discount.toFixed(0);
            order.totalPrice = order.totalPrice.toFixed(2);
        }

        res.render("client/pages/checkout/order-review", {
            title: "Xem lại đơn hàng",
            orders: orders,
        });
    } catch (error) {
        res.redirect("/");
    }
};

module.exports.cancelOrder = async (req, res) => {
    const idOrder = req.params.id;
    const requestCancel = {
        status: "initial",
        reason: "",
    };
    await Order.updateOne(
        {
            _id: idOrder,
        },
        {
            cancel: requestCancel,
        }
    );
    req.flash(
        "success",
        "Yêu cầu hủy đơn hành thành công! Vui lòng đợi kết quả!"
    );
    res.redirect("back");
};
