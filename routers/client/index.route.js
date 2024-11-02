//La file tong chua tat ca cac route
const homeRoutes = require("./home.route");
//Route trang san pham
const productRoutes = require("./products.route");
//Route trang tim kiem
const searchRoutes = require("./search.route");
//Route trang gio hang
const cartRoutes = require("./carts.route");
//Route trang dat hang
const checkoutRouters = require("./checkout.route");
//Route trang dat hang
const blogRouters = require("./blogs.route");
//Route trang dat hang
const couponRouters = require("./coupons.route");
//Route trang user
const userRouters = require("./users.route");
//Cart middleware
const cartMiddleware = require("../../middlewares/client/cart.middleware");
//User middleware
const userMiddleware = require("../../middlewares/client/user.middleware");
//Setting middleware
const settingMiddleware = require("../../middlewares/admin/setting.middleware");
module.exports = (app) => {
    //Route trang chu
    app.use(
        "/",
        cartMiddleware.cart,
        settingMiddleware.general,
        userMiddleware.user,
        homeRoutes
    );
    //Route trang san pham
    app.use(
        "/products",
        cartMiddleware.cart,
        userMiddleware.user,
        productRoutes
    );
    //Route trang tim kiem
    app.use(
        "/search",
        cartMiddleware.cart,
        settingMiddleware.general,
        userMiddleware.user,
        searchRoutes
    );
    //Route trang gio hang
    app.use(
        "/cart",
        cartMiddleware.cart,
        settingMiddleware.general,
        userMiddleware.user,
        cartRoutes
    );
    //Route trang checkout
    app.use(
        "/checkout",
        cartMiddleware.cart,
        userMiddleware.user,
        settingMiddleware.general,
        checkoutRouters
    );
    //Route trang user
    app.use(
        "/user",
        cartMiddleware.cart,
        userMiddleware.user,
        settingMiddleware.general,
        userRouters
    );
    //Route page blogs
    app.use("/blogs", cartMiddleware.cart, userMiddleware.user, blogRouters);
    //Route page coupons
    app.use(
        "/coupons",
        cartMiddleware.cart,
        userMiddleware.user,
        couponRouters
    );
};
