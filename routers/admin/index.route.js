const path_admin = require("../../config/system");
const authMiddleware = require("../../middlewares/admin/auth.middleware");
//Embedd route setting general
const settingGeneralRoute = require("./setting-general.route");
//Embedd route dashboard
const dashboardRoute = require("./dashboard.route");
//Embedd route products
const productRoute = require("./products.route");
//Embedd route bin
const binRoute = require("./bin.route");
//Embedd route products-category
const productCategoryRoute = require("./products-category.route");
//Embedd route roles
const roleRoute = require("./roles.route");
//Embedd route account
const accountRoute = require("./accounts.route");
//Embedd route auth
const authRoute = require("./auth.route");
//Embedd route users
const userRoute = require("./users.route");
//Embedd route brands
const brandRoute = require("./brands.route");
//Embedd route blogs-category
const blogCategoryRoute = require("./blogs-category.route");
//Embedd route blogs
const blogRoute = require("./blogs.route");

module.exports = (app) => {
    //Use route dashboard
    app.use(
        path_admin.prefixAdmin + "/setting",
        authMiddleware.login,
        settingGeneralRoute
    );
    //Use route dashboard
    app.use(
        path_admin.prefixAdmin + "/dashboard",
        authMiddleware.login,
        dashboardRoute
    );
    //Use route products
    app.use(
        path_admin.prefixAdmin + "/products",
        authMiddleware.login,
        productRoute
    );
    //Use route bin
    app.use(
        path_admin.prefixAdmin + "/bin-products",
        authMiddleware.login,
        binRoute
    );
    //Use route products-category
    app.use(
        path_admin.prefixAdmin + "/products-category",
        authMiddleware.login,
        productCategoryRoute
    );
    //Use route brands
    app.use(
        path_admin.prefixAdmin + "/brands",
        authMiddleware.login,
        brandRoute
    );
    //Use route blogs-category
    app.use(
        path_admin.prefixAdmin + "/blogs-category",
        authMiddleware.login,
        blogCategoryRoute
    );
    //Use route brands
    app.use(path_admin.prefixAdmin + "/blogs", authMiddleware.login, blogRoute);
    //Use route roles
    app.use(path_admin.prefixAdmin + "/roles", authMiddleware.login, roleRoute);
    //Use route account
    app.use(
        path_admin.prefixAdmin + "/accounts",
        authMiddleware.login,
        accountRoute
    );
    //Use route users
    app.use(path_admin.prefixAdmin + "/users", authMiddleware.login, userRoute);
    //Use route auth
    app.use(path_admin.prefixAdmin + "/auth", authRoute);
};
