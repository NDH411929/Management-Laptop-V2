const User = require("../../models/user.model");
module.exports.user = async (req, res, next) => {
    if (req.cookies.tokenUser) {
        const infoUser = await User.findOne({
            tokenUser: req.cookies.tokenUser,
            deleted: false,
        });
        res.locals.infoUser = infoUser;
    }
    next();
};
