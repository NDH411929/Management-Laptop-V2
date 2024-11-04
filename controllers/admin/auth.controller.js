const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require("md5");
//Use MD5 encode password
const systemConfig = require("../../config/system");

module.exports.login = async (req, res) => {
    try {
        if (req.cookies.token) {
            res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
        } else {
            res.render("admin/pages/auth/login", {
                title: "Đăng nhập",
            });
        }
    } catch {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
};

module.exports.loginPost = async (req, res) => {
    try {
        req.body.password = md5(req.body.password);
        const user = await Account.findOne({
            email: req.body.email,
            deleted: false,
        });
        // const roleUser = await Role.findOne({
        //     _id: user.role_id,
        // }).select("status");
        if (!user) {
            req.flash("error", "Email không tồn tại");
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        } else {
            if (user.status == "inactive") {
                req.flash("error", "Tài khoản đã bị khóa");
                res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
            } else {
                if (user.password !== req.body.password) {
                    req.flash("error", "Nhập sai mật khẩu");
                    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
                } else {
                    res.cookie("token", user.token);
                    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
                }
            }
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
};

module.exports.logout = async (req, res) => {
    res.clearCookie("token", req.cookies.token);
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};
