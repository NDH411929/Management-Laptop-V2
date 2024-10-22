const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const Brand = require("../../models/brand.model");
const paginationHelper = require("../../helpers/pagination.helper");
const createTreeHelper = require("../../helpers/createTree.helper");
const filterStatusHelper = require("../../helpers/filterStatus.helper");
const searchHelper = require("../../helpers/search.helper");
const systemConfig = require("../../config/system");

module.exports.productsCategory = async (req, res) => {
    try {
        let findListCategory = {
            deleted: false,
        };

        //filterStatus
        const filterStatus = filterStatusHelper(req.query);
        if (req.query.status) {
            //req.query là trả ra các query trên url (?status="active") hoặc (?price=123)
            findListCategory.status = req.query.status;
        }
        //End filter status

        //Search
        const searchProductsCategory = searchHelper(req.query);
        if (searchProductsCategory.regex) {
            findListCategory.title = searchProductsCategory.regex;
        }
        //End search

        const records = await ProductCategory.find(findListCategory);
        const newRecords = createTreeHelper.tree(records);
        newRecords.sort((a, b) => {
            if (a.position > b.position) {
                return 1;
            } else {
                return -1;
            }
        });
        //Phần render ra ngoài view
        res.render("admin/pages/products-category/index", {
            title: "Danh mục sản phẩm",
            records: newRecords,
            filterStatus: filterStatus,
            keyword: searchProductsCategory.keyword,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};

module.exports.changeStatus = async (req, res) => {
    try {
        if (
            res.locals.roleUser.permissions.includes("products-category_edit")
        ) {
            const id = req.params.id;
            const status = req.params.status;
            let updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            };
            await ProductCategory.updateOne(
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
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};

module.exports.create = async (req, res) => {
    try {
        let findListCategory = {
            deleted: false,
        };

        const records = await ProductCategory.find(findListCategory);
        const newRecords = createTreeHelper.tree(records);
        res.render("admin/pages/products-category/create", {
            title: "Danh mục sản phẩm",
            records: newRecords,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};

module.exports.createPost = async (req, res) => {
    try {
        if (
            res.locals.roleUser.permissions.includes("products-category_create")
        ) {
            if (req.body.position == "") {
                const count = await ProductCategory.countDocuments({});
                req.body.position = count + 1;
            } else {
                req.body.position = parseInt(req.body.position);
            }
            let createdBy = {
                account_id: res.locals.user.id,
                createdAt: new Date(),
            };
            req.body.createdBy = createdBy;
            if (req.body.parent_id != "") {
                const parentCategory = await ProductCategory.findOne({
                    _id: req.body.parent_id,
                    deleted: false,
                });
                req.body.specifications = parentCategory.specifications;
                req.body.features_spec = parentCategory.features_spec;
                req.body.brands = parentCategory.brands;
            }
            const productCategory = new ProductCategory(req.body);
            productCategory.save();
            req.flash("success", "Thêm danh mục thành công!");
            res.redirect("back");
        } else {
            res.send("404");
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};

module.exports.createSpecification = async (req, res) => {
    try {
        const id = req.params.id;

        let findListCategory = {
            deleted: false,
        };

        let findOneCategory = {
            _id: id,
            deleted: false,
        };

        const records = await ProductCategory.find(findListCategory);
        // const newRecords = createTreeHelper.tree(records);
        const dataProductCategory = await ProductCategory.findOne(
            findOneCategory
        );
        res.render("admin/pages/products-category/create-speci", {
            title: "Danh mục sản phẩm",
            // records: newRecords,
            data: dataProductCategory,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};

module.exports.createSpecificationPost = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await ProductCategory.findOne({
            _id: id,
            deleted: false,
        });
        const existSpec = category.specifications.find(
            (element) => element.nameSpec == req.body.nameSpec
        );
        if (existSpec) {
            req.flash("error", "Thông số đã tồn tại!");
        } else {
            await ProductCategory.updateOne(
                {
                    _id: id,
                },
                {
                    $push: {
                        specifications: req.body,
                    },
                }
            );
            req.flash("success", "Thêm thông số thành công!");
        }

        res.redirect("back");
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};

module.exports.createFeaturesSpecPost = async (req, res) => {
    try {
        if (
            res.locals.roleUser.permissions.includes("products-category_create")
        ) {
            const id = req.params.id;
            const category = await ProductCategory.findOne({
                _id: id,
                deleted: false,
            });
            const existSpec = category.features_spec.find(
                (element) =>
                    element.nameFeaturesSpec == req.body.nameFeaturesSpec
            );
            if (existSpec) {
                req.flash("error", "Thông số đã tồn tại!");
            } else {
                await ProductCategory.updateOne(
                    {
                        _id: id,
                    },
                    {
                        $push: {
                            features_spec: req.body,
                        },
                    }
                );
                req.flash("success", "Thêm thông số thành công!");
            }

            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

module.exports.createBrand = async (req, res) => {
    try {
        const id = req.params.id;
        //Get category need update
        const data = await ProductCategory.findOne({
            _id: id,
            deleted: false,
        });
        // //Get list brands
        const brands = await Brand.find({
            deleted: false,
        });
        const brandOfCategory = await Brand.find({
            _id: { $in: data.brands },
            deleted: false,
        });
        data.brandOfCategory = brandOfCategory;
        //Get parent category
        if (data.parent_id != "") {
            const parentCategory = await ProductCategory.findOne({
                _id: data.parent_id,
                deleted: false,
            }).select("title");
            data.parentCategory = parentCategory.title;
        } else {
            data.parentCategory = "Không có danh mục cha";
        }

        res.render("admin/pages/products-category/create-brand", {
            title: "Danh mục sản phẩm",
            data: data,
            brands: brands,
            parentCategory: data.parentCategory,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};

module.exports.createBrandPost = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await ProductCategory.findOne({
            _id: id,
            deleted: false,
        });
        const brands = category.brands.map((element) => {
            return element;
        });
        if (req.body.brand) {
            if (brands.includes(req.body.brand)) {
                req.flash("error", "Thương hiệu đã tồn tại!");
                res.redirect("back");
                return;
            }
            brands.push(req.body.brand);
            await ProductCategory.updateOne(
                {
                    _id: id,
                    deleted: false,
                },
                {
                    brands: brands,
                }
            );
            req.flash("success", "Thêm thương hiệu thành công!");
            res.redirect("back");
        } else {
            req.flash("error", "Vui lòng chọn thương hiệu!");
            res.redirect("back");
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const records = await ProductCategory.find({
            deleted: false,
        });

        const newRecords = createTreeHelper.tree(records);

        const dataProductCategory = await ProductCategory.findOne({
            _id: id,
            deleted: false,
        });
        res.render("admin/pages/products-category/edit", {
            title: "Chỉnh sửa danh mục sản phẩm",
            records: newRecords,
            data: dataProductCategory,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};

module.exports.editPatch = async (req, res) => {
    try {
        if (
            res.locals.roleUser.permissions.includes("products-category_edit")
        ) {
            const id = req.params.id;
            req.body.position = parseInt(req.body.position);
            let updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            };
            const category = await ProductCategory.findOne({
                _id: id,
            });
            const categoryParent = await ProductCategory.findOne({
                _id: req.body.parent_id,
            });
            if (category.parent_id != req.body.parent_id) {
                await ProductCategory.updateOne(
                    { _id: id },
                    {
                        features_spec: [],
                        specifications: [],
                    }
                );
                await ProductCategory.updateOne(
                    { _id: id },
                    {
                        $push: {
                            features_spec: categoryParent.features_spec,
                            specifications: categoryParent.specifications,
                            updatedBy: updatedBy,
                        },
                    }
                );
            }
            await ProductCategory.updateOne(
                { _id: id },
                {
                    ...req.body,
                    $push: {
                        updatedBy: updatedBy,
                    },
                }
            );
            req.flash("success", "Cập nhật danh mục thành công!");
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};

module.exports.editSpecification = async (req, res) => {
    try {
        const idCate = req.params.idCate;
        const idSpec = req.params.idSpec;
        const category = await ProductCategory.findOne({
            _id: idCate,
            deleted: false,
        });
        const specCate = category.specifications.find((element) => {
            if (element.id == idSpec) {
                return element;
            }
        });
        res.render("admin/pages/products-category/edit-specification", {
            title: "Chỉnh sửa thông số",
            category: category,
            specCate: specCate,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

module.exports.editSpecificationPatch = async (req, res) => {
    try {
        const role = res.locals.roleUser.permissions;
        if (
            role.includes("products-category_edit") ||
            role.includes("products-categoy_create")
        ) {
            const idCate = req.params.idCate;
            const idSpec = req.params.idSpec;
            //History updated
            let updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            };
            await ProductCategory.updateOne(
                {
                    _id: idCate,
                    "specifications._id": idSpec,
                },
                {
                    $set: {
                        "specifications.$.nameSpec": req.body.nameSpec,
                    },
                    $push: {
                        updatedBy: updatedBy,
                    },
                }
            );

            req.flash("success", "Sửa thành công!");
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

module.exports.editFeaturesSpec = async (req, res) => {
    try {
        const idCate = req.params.idCate;
        const idSpec = req.params.idSpec;
        const category = await ProductCategory.findOne({
            _id: idCate,
            deleted: false,
        });
        const featureSpec = category.features_spec.find((element) => {
            if (element.id == idSpec) {
                return element;
            }
        });
        res.render("admin/pages/products-category/edit-features", {
            title: "Chỉnh sửa sản phẩm",
            category: category,
            featureSpec: featureSpec,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

module.exports.editFeaturesSpecPatch = async (req, res) => {
    try {
        const role = res.locals.roleUser.permissions;
        if (
            role.includes("products-category_edit") ||
            role.includes("products-category_create")
        ) {
            const idCate = req.params.idCate;
            const idSpec = req.params.idSpec;
            //History updated
            let updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            };
            await ProductCategory.updateOne(
                {
                    _id: idCate,
                    "features_spec._id": idSpec,
                },
                {
                    $set: {
                        "features_spec.$.nameFeaturesSpec":
                            req.body.nameFeaturesSpec,
                        "features_spec.$.valueDefault": req.body.valueDefault,
                    },
                    $push: {
                        updatedBy: updatedBy,
                    },
                }
            );

            req.flash("success", "Sửa thành công!");
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};

module.exports.deleteProductsCategory = async (req, res) => {
    try {
        if (
            res.locals.roleUser.permissions.includes("products-category_delete")
        ) {
            const id = req.params.id;
            let deletedBy = {
                account_id: res.locals.user.id,
                deletedAt: new Date(),
            };
            await ProductCategory.updateOne(
                { _id: id },
                {
                    deleted: true,
                    deletedBy,
                }
            );
            req.flash("success", "Xóa danh mục thành công!");
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};

module.exports.deleteSpecification = async (req, res) => {
    try {
        if (
            res.locals.roleUser.permissions.includes("products-category_delete")
        ) {
            const idCate = req.params.idCate;
            const idSpec = req.params.idSpec;
            await ProductCategory.updateOne(
                { _id: idCate },
                {
                    $pull: { specifications: { _id: idSpec } },
                }
            );
            req.flash("success", "Xóa thông số thành công!");
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};

module.exports.deleteFeaturesSpec = async (req, res) => {
    try {
        const role = res.locals.roleUser.permissions;
        if (role.includes("products-category_edit")) {
            const idCate = req.params.idCate;
            const idSpec = req.params.idSpec;
            let updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            };
            await ProductCategory.updateOne(
                { _id: idCate },
                {
                    $pull: {
                        features_spec: { _id: idSpec },
                    },
                    $push: {
                        updatedBy: updatedBy,
                    },
                }
            );
            req.flash("success", "Xóa thành công!");
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const record = await ProductCategory.findOne({
            _id: id,
            deleted: false,
        });
        const data = await ProductCategory.find({
            deleted: false,
        });
        const brands = await Brand.find({
            _id: { $in: record.brands },
            deleted: false,
        });
        record.brands = brands;
        if (record.createdBy) {
            const user = await Account.findOne({
                _id: record.createdBy.account_id,
            }).select("fullName");
            if (user) {
                record.fullNameCreated = user.fullName;
            }
        }

        if (record.updatedBy.length > 0) {
            const user = await Account.findOne({
                _id: record.updatedBy[record.updatedBy.length - 1].account_id,
            }).select("fullName");
            if (user) {
                record.fullNameUpdated = user.fullName;
            }
        }
        res.render("admin/pages/products-category/detail", {
            title: "Danh mục sản phẩm",
            record: record,
            data: data,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};

//Chức năng tìm kiếm: Tìm 1 danh mục sẽ hiển thị các danh mục con của nó
