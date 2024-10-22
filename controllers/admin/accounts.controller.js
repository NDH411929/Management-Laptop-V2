const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require("md5");
//Use MD5 encode password
const filterStatusHelper = require("../../helpers/filterStatus.helper");
const searchHelper = require("../../helpers/search.helper");
const systemConfig = require("../../config/system");

module.exports.account = async (req, res) => {
    try {
        let findListAccounts = {
            deleted: false,
        };
        let findListRoles = {
            deleted: false,
        };
        //filterStatus
        const filterStatus = filterStatusHelper(req.query);
        if (req.query.status) {
            //req.query là trả ra các query trên url (?status="active") hoặc (?price=123)
            findListAccounts.status = req.query.status;
        }
        //End filter status

        //Search
        const searchAccounts = searchHelper(req.query);
        if (searchAccounts.regex) {
            findListAccounts.fullName = searchAccounts.regex;
        }
        //End search
        const accounts = await Account.find(findListAccounts).select(
            "-password -token"
        );
        const roles = await Role.find(findListRoles);
        res.render("admin/pages/account/index", {
            title: "Account",
            records: accounts,
            filterStatus: filterStatus,
            keyword: searchAccounts.keyword,
            roles: roles,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.changeStatus = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("account_edit")) {
            const id = req.params.id;
            const status = req.params.status;
            let updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            };
            await Account.updateOne(
                { _id: id },
                {
                    status: status,
                    $push: {
                        updatedBy: updatedBy,
                    },
                }
            );
            req.flash("success", "Thay đổi trạng thái thành công!");
            res.redirect("back");
        } else {
            res.send("404");
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.create = async (req, res) => {
    try {
        let findListRoles = {
            deleted: false,
        };
        const roles = await Role.find(findListRoles);
        res.render("admin/pages/account/create", {
            title: "Create account",
            roles: roles,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.createPost = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("account_create")) {
            let findEmail = {
                deleted: false,
                email: req.body.email,
            };
            let findPhoneNumber = {
                deleted: false,
                phoneNumber: req.body.phoneNumber,
            };
            let createdBy = {
                account_id: res.locals.user.id,
                createdAt: new Date(),
            };
            const emailExist = await Account.findOne(findEmail);
            const phoneNumberExist = await Account.findOne(findPhoneNumber);
            if (emailExist || phoneNumberExist) {
                req.flash("error", "Email hoặc số điện thoại đã tồn tại");
            } else {
                //Encode password
                req.body.password = md5(req.body.password);
                req.body.createdBy = createdBy;
                const account = await Account.create(req.body);
                account.save();
                req.flash("success", "Thêm tài khoản thành công");
            }
            res.redirect("back");
        } else {
            res.send("404");
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        let findOneAccount = {
            _id: id,
            deleted: false,
        };
        let findListRoles = {
            deleted: false,
        };
        const roles = await Role.find(findListRoles);
        const dataAccount = await Account.findOne(findOneAccount);
        res.render("admin/pages/account/edit", {
            title: "Edit account",
            roles: roles,
            data: dataAccount,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.editPatch = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("account_edit")) {
            const id = req.params.id;
            if (req.body.password) {
                req.body.password = md5(req.body.password);
            } else {
                delete req.body.password;
            }
            let updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            };
            await Account.updateOne(
                { _id: id },
                {
                    ...req.body,
                    $push: {
                        updatedBy: updatedBy,
                    },
                }
            );
            req.flash("success", "Cập nhật tài khoản thành công");
            res.redirect("back");
        } else {
            res.send("404");
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.deleteAccount = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("account_delete")) {
            const id = req.params.id;
            let deletedBy = {
                account_id: res.locals.user.id,
                deletedAt: new Date(),
            };
            await Account.updateOne(
                { _id: id },
                { deleted: true, deletedBy: deletedBy }
            );
            req.flash("success", "Xóa tài khoản thành công!");
            res.redirect("back");
        } else {
            res.send("404");
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const account = await Account.findOne(
            {
                _id: id,
            },
            {
                deleted: false,
            }
        ).select("-password");
        if (account.createdBy) {
            const user = await Account.findOne({
                _id: account.createdBy.account_id,
            }).select("fullName");
            if (user) {
                account.fullNameCreated = user.fullName;
            }
        }
        if (account.updatedBy.length > 0) {
            const user = await Account.findOne({
                _id: account.updatedBy[account.updatedBy.length - 1].account_id,
            });
            if (user) {
                account.fullNameUpdated = user.fullName;
            }
        }
        const role = await Role.findOne({ _id: account.role_id });
        if (role) {
            account.role = role.title;
            account.roleDesc = role.description;
        }
        res.render("admin/pages/account/detail", {
            title: "Detail Account",
            record: account,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};
//Tao regex cho password ,email, sdt
