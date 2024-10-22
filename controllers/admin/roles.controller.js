const Role = require("../../models/role.model");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

module.exports.roles = async (req, res) => {
    try {
        let findListRoles = {
            deleted: false,
        };
        const roles = await Role.find(findListRoles);
        res.render("admin/pages/roles/index", {
            title: "Nhóm quyền",
            records: roles,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};

module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        title: "Tạo mới nhóm quyền",
    });
};

module.exports.createPost = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("roles_create")) {
            let createdBy = {
                account_id: res.locals.user.id,
                createdAt: new Date(),
            };
            req.body.createdBy = createdBy;
            const role = await Role.create(req.body);
            role.save();
            req.flash("success", "Thêm quyền thành công!");
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        let findOneRole = {
            _id: id,
            deleted: false,
        };
        const role = await Role.findOne(findOneRole);
        res.render("admin/pages/roles/edit", {
            title: "Chỉnh sửa nhóm quyền",
            role: role,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};

module.exports.editPatch = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("roles_edit")) {
            const id = req.params.id;
            let updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            };
            await Role.updateOne(
                { _id: id },
                {
                    ...req.body,
                    $push: {
                        updatedBy: updatedBy,
                    },
                }
            );
            req.flash("success", "Cập nhật quyền thành công!");
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};

module.exports.deleteRole = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("roles_delete")) {
            const id = req.params.id;
            let deletedBy = {
                account_id: res.locals.user.id,
                deletedAt: new Date(),
            };
            await Role.updateOne(
                { _id: id },
                { deleted: true, deletedBy: deletedBy }
            );
            req.flash("success", "Xóa quyền thành công!");
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};

module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        let findOneRole = {
            _id: id,
            deleted: false,
        };
        const role = await Role.findOne(findOneRole);

        //History created
        if (role.createdBy) {
            const user = await Account.findOne({
                _id: role.createdBy.account_id,
            }).select("fullName");
            if (user) {
                role.fullNameCreated = user.fullName;
            }
        }
        //History created

        //History updated
        if (role.updatedBy.length > 0) {
            const user = await Account.findOne({
                _id: role.updatedBy[role.updatedBy.length - 1].account_id,
            }).select("fullName");
            if (user) {
                role.fullNameUpdated = user.fullName;
            }
        }
        //History updated

        let arrRole = [];
        const listPermission = role.permissions;
        for (const item of listPermission) {
            const [title, permission] = item.split("_");
            if (arrRole.length > 0) {
                for (var i = 0; i < arrRole.length; i++) {
                    if (arrRole[i].title == title) {
                        arrRole[i].arrayPermission.push(permission);
                    } else {
                        if (i == arrRole.length - 1) {
                            let object = {
                                title: "",
                                arrayPermission: [],
                            };
                            object.title = title;
                            object.arrayPermission.push(permission);
                            arrRole.push(object);
                            break;
                        }
                    }
                }
            } else {
                const object = {
                    title: "",
                    arrayPermission: [],
                };
                object.title = title;
                object.arrayPermission.push(permission);
                arrRole.push(object);
            }
        }

        let totalPermission = [];
        for (const i of arrRole) {
            for (const k of i.arrayPermission) {
                const find = totalPermission.find((element) => {
                    return element == k;
                });
                if (!find) {
                    totalPermission.push(k);
                }
            }
        }
        res.render("admin/pages/roles/detail", {
            title: "Chi tiết quyền",
            record: role,
            array: arrRole,
            totalPermission: totalPermission,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};

module.exports.permissions = async (req, res) => {
    try {
        let findListRoles = {
            deleted: false,
        };
        const roles = await Role.find(findListRoles);
        res.render("admin/pages/roles/permissions", {
            title: "Phân quyền",
            records: roles,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};

module.exports.permissionsPatch = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("roles_permissions")) {
            const roles = JSON.parse(req.body.roles);
            let updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            };
            for (const role of roles) {
                await Role.updateOne(
                    { _id: role.id },
                    {
                        permissions: role.permissions,
                        $push: {
                            updatedBy: updatedBy,
                        },
                    }
                );
            }
            req.flash("success", "Cập nhật thành công!");
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};
