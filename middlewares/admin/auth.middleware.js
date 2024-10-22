const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
module.exports.login = async (req, res, next) => {
    if (!req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        return;
    } else {
        const user = await Account.findOne({ token: req.cookies.token }).select(
            "-password"
        );
        if (!user) {
            res.clearCookie("token");
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
            return;
        } else {
            const roleUser = await Role.findOne({ _id: user.role_id }).select(
                "title permissions"
            );
            res.locals.user = user;
            res.locals.roleUser = roleUser;
            next();
        }
    }
};
