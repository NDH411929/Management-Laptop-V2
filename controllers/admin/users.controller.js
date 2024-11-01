const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Coupon = require("../../models/coupon.model");
const User = require("../../models/user.model");
const filterStatusHelper = require("../../helpers/filterStatus.helper");
const searchHelper = require("../../helpers/search.helper");
const sortHelper = require("../../helpers/sort.helper");
const paginationHelper = require("../../helpers/pagination.helper");
const createTreeHelper = require("../../helpers/createTree.helper");
const systemConfig = require("../../config/system");

module.exports.orders = async (req, res) => {
    try {
        let findListOrder = {
            deleted: false,
        };
        const filterStatusHelper = (query) => {
            let filterStatus = [
                {
                    name: "Tất cả",
                    status: "",
                    class: "",
                },
                {
                    name: "Chờ phê duyệt",
                    status: "initial",
                    class: "",
                },
                {
                    name: "Đã duyệt",
                    status: "approved",
                    class: "",
                },
                {
                    name: "Đang vận chuyển",
                    statusDelivery: "shipping",
                    class: "",
                },
                {
                    name: "Ngừng vận chuyển",
                    statusDelivery: "stop-shipping",
                    class: "",
                },
                {
                    name: "Đã giao",
                    statusDelivery: "delivered",
                    class: "",
                },
            ];

            if (query.status) {
                const index = filterStatus.findIndex(
                    //Tim index cua phan tu co status = params tren url
                    (item) => item.status == query.status
                );
                filterStatus[index].class = "active";
            } else if (query.statusDelivery) {
                const index = filterStatus.findIndex(
                    //Tim index cua phan tu co statusDelivery = params tren url
                    (item) => item.statusDelivery == query.statusDelivery
                );
                filterStatus[index].class = "active";
            } else {
                const index = filterStatus.findIndex(
                    //Tim index cua phan tu co status = params tren url
                    (item) => item.status == ""
                );
                filterStatus[index].class = "active";
            }

            return filterStatus;
        };

        //filterStatus
        // const filterStatus = filterStatusHelper(req.query);
        const test = filterStatusHelper(req.query);
        if (req.query.status) {
            //req.query là trả ra các query trên url (?status="active") hoặc (?price=123)
            findListOrder.status = req.query.status;
        } else if (req.query.statusDelivery) {
            findListOrder.statusDelivery = req.query.statusDelivery;
        }
        //End filter status

        //Search
        const searchOrders = searchHelper(req.query);
        if (searchOrders.regex) {
            findListOrder.title = searchOrders.regex;
        }
        //End search

        //Pagination

        //Calculate Total Products
        const countOrders = await Order.countDocuments(findListOrder);

        const objectPagination = paginationHelper(
            {
                currentPage: 1,
                limitItem: 10,
            },
            req.query,
            countOrders
        );
        //End Pagination
        let sort = {};
        if (req.query.keySelect && req.query.keyValue) {
            sort[req.query.keySelect] = req.query.keyValue;
        } else {
            sort.createdAt = "desc";
        }
        // const sorted = Object.keys()
        const orders = await Order.find(findListOrder)
            .sort(sort)
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skip);

        // for (const product of orders) {
        //     const user = await Account.findOne({
        //         _id: product.createdBy.account_id,
        //     }).select("-password");

        //     if (user) {
        //         product.createdByFullName = user.fullName;
        //     }
        // }
        //Phần render ra ngoài view
        res.render("admin/pages/orders/index", {
            title: "Order",
            orders: orders,
            filterStatus: test,
            keyword: searchOrders.keyword,
            pagination: objectPagination,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.changeStatus = async (req, res) => {
    try {
        // console.log(req.params.status + " " + req.params.id);
        if (req.params.status == "initial") {
            await Order.updateOne(
                {
                    _id: req.params.id,
                },
                {
                    statusDelivery: "stop-shipping",
                }
            );
        } else {
            await Order.updateOne(
                {
                    _id: req.params.id,
                },
                {
                    statusDelivery: "processing",
                }
            );
        }
        await Order.updateOne(
            {
                _id: req.params.id,
            },
            {
                status: req.params.status,
            }
        );
        res.redirect("back");
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.changeStatusDelivery = async (req, res) => {
    try {
        // console.log(req.params.status + " " + req.params.id);
        await Order.updateOne(
            {
                _id: req.params.id,
            },
            {
                statusDelivery: req.params.statusDelivery,
            }
        );
        res.redirect("back");
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.deleteOrder = async (req, res) => {
    try {
        const id = req.params.id;
        await Order.updateOne(
            {
                _id: id,
            },
            {
                deleted: true,
            }
        );
        req.flash("success", "Xóa đơn hàng thành công!");
        res.redirect("back");
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.detailOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await Order.findOne({
            _id: id,
            deleted: false,
        });
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
            });
            order.couponUsed = coupon;
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
        res.render("admin/pages/orders/detail", {
            title: "Detail Order",
            order: order,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.accountsUser = async (req, res) => {
    let findListAccount = {
        deleted: false,
    };

    //filterStatus
    const filterStatus = filterStatusHelper(req.query);
    if (req.query.status) {
        findListAccount.status = req.query.status;
    }
    //End filter status

    //Search
    const searchAccount = searchHelper(req.query);
    if (searchAccount.regex) {
        findListAccount.fullName = searchAccount.regex;
    }
    //End search

    //Pagination

    //Calculate Total Products
    const countAccount = await User.countDocuments(findListAccount);

    const objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItem: 10,
        },
        req.query,
        countAccount
    );
    //End Pagination
    const records = await User.find(findListAccount)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);

    //Sort
    for (const record of records) {
        const countOrders = await Order.countDocuments({
            cart_id: record.cartId,
            deleted: false,
        });
        record.countOrders = countOrders;
    }

    const key = req.query.keySelect;
    const value = req.query.keyValue;
    sortHelper.sorted(key, value, records);
    //End sort

    //Phần render ra ngoài view
    res.render("admin/pages/accounts-user/index", {
        title: "Account User",
        records: records,
        filterStatus: filterStatus,
        keyword: searchAccount.keyword,
        pagination: objectPagination,
    });
};

module.exports.changeStatusAccount = async (req, res) => {
    try {
        await User.updateOne(
            {
                _id: req.params.id,
            },
            {
                status: req.params.status,
            }
        );
        req.flash("success", "Thay đổi trạng thái thành công!");
        res.redirect("back");
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.deleteAccount = async (req, res) => {
    try {
        const id = req.params.id;
        await User.updateOne(
            {
                _id: id,
            },
            {
                deleted: true,
            }
        );
        req.flash("success", "Xóa tài khoản thành công!");
        res.redirect("back");
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.detailAccount = async (req, res) => {
    try {
        const id = req.params.id;
        const accountUser = await User.findOne(
            {
                _id: id,
            },
            {
                deleted: false,
            }
        );
        const countOrders = await Order.countDocuments(
            {
                cart_id: accountUser.cartId,
            },
            {
                deleted: false,
            }
        );
        accountUser.countOrders = countOrders;
        const cartUser = await Cart.findOne(
            {
                _id: accountUser.cartId,
            },
            {
                deleted: false,
            }
        );

        for (const item of cartUser.products) {
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
            item.price = infoProduct.price;
            item.features = infoProduct.features;
            item.stock = infoProduct.stock;
            item.thumbnail = infoProduct.thumbnail;
            item.priceNew = infoProduct.priceNew;
            // item.totalPrice = infoProduct.totalPrice;
        }
        res.render("admin/pages/accounts-user/detail", {
            title: "Detail Account User",
            accountUser: accountUser,
            cartUser: cartUser,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};
