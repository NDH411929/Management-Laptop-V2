const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const ProductCategory = require("../../models/product-category.model");
const Brand = require("../../models/brand.model");
const filterStatusHelper = require("../../helpers/filterStatus.helper");
const searchHelper = require("../../helpers/search.helper");
const paginationHelper = require("../../helpers/pagination.helper");
const systemConfig = require("../../config/system");

module.exports.brands = async (req, res) => {
    try {
        const findBrands = {
            deleted: false,
        };
        //filterStatus
        const filterStatus = filterStatusHelper(req.query);
        if (req.query.status) {
            //req.query là trả ra các query trên url (?status="active") hoặc (?price=123)
            findBrands.status = req.query.status;
        }
        //End filter status

        //Search
        const searchBrand = searchHelper(req.query);
        if (searchBrand.regex) {
            findBrands.name = searchBrand.regex;
        }
        //End search
        const brands = await Brand.find(findBrands);

        for (const brand of brands) {
            const user = await Account.findOne({
                _id: brand.createdBy.account_id,
            }).select("-password");

            if (user) {
                brand.createdByFullName = user.fullName;
            }
        }
        res.render("admin/pages/brands/index", {
            title: "Brands",
            brands: brands,
            filterStatus: filterStatus,
            keyword: searchBrand.keyword,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.changeStatus = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("brands_edit")) {
            const status = req.params.status;
            const id = req.params.id;
            //History update
            let updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            };
            await Brand.updateOne(
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
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.createBrand = async (req, res) => {
    try {
        res.render("admin/pages/brands/create", {
            title: "Brands",
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.createBrandPost = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("brands_create")) {
            if (req.body.name) {
                const exists = await Brand.findOne({
                    name: req.body.name,
                    deleted: false,
                });
                if (exists) {
                    req.flash("error", "Thương hiệu đã tồn tại!");
                    res.redirect("back");
                    return;
                }
                if (req.body.position == "") {
                    const count = await Brand.countDocuments({});
                    req.body.position = count + 1;
                } else {
                    req.body.position = parseInt(req.body.position);
                }
                //History created
                let createdBy = {
                    account_id: res.locals.user.id,
                    createdAt: new Date(),
                };
                req.body.createdBy = createdBy;
                const brand = new Brand(req.body);
                brand.save();
                req.flash("success", "Thêm thương hiệu thành công!");
            }
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const brand = await Brand.findOne({
            _id: id,
            deleted: false,
        });

        res.render("admin/pages/brands/edit", {
            title: "Chỉnh sửa thương hiệu",
            brand: brand,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.editPatch = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("brands_edit")) {
            const id = req.params.id;

            //History updated
            let updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            };

            await Brand.updateOne(
                { _id: id },
                {
                    ...req.body,
                    $push: {
                        updatedBy: updatedBy,
                    },
                }
            );

            req.flash("success", "Sửa thương hiệu thành công!");
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.delete = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("brands_delete")) {
            const id = req.params.id;
            await Brand.updateOne(
                { _id: id },
                {
                    deleted: true,
                    deletedBy: {
                        account_id: res.locals.user.id,
                        deletedAt: new Date(),
                    },
                }
            );
            req.flash("success", "Xóa thương hiệu thành công!");
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.uploadImageBrand = async (req, res) => {
    try {
        const id = req.params.idBrand;
        res.render("admin/pages/brands/upload", {
            title: "Brands",
            idBrand: id,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.uploadImageBrandPost = async (req, res) => {
    try {
        const id = req.params.idBrand;
        await Brand.updateOne(
            {
                _id: id,
            },
            {
                imagesBrand: req.body.listImage,
            }
        );
        req.flash("success", "Thêm ảnh thành công!");
        res.redirect("back");
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const brand = await Brand.findOne(
            {
                _id: id,
            },
            {
                deleted: false,
            }
        );
        if (brand.createdBy) {
            const user = await Account.findOne({
                _id: brand.createdBy.account_id,
            }).select("fullName");
            if (user) {
                brand.fullNameCreated = user.fullName;
            }
        }
        if (brand.updatedBy.length > 0) {
            const user = await Account.findOne({
                _id: brand.updatedBy[brand.updatedBy.length - 1].account_id,
            });
            if (user) {
                brand.fullNameUpdated = user.fullName;
            }
        }
        res.render("admin/pages/brands/detail", {
            title: "Detail Brand",
            record: brand,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};
