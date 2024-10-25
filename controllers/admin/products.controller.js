const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const Brand = require("../../models/brand.model");
const ProductCategory = require("../../models/product-category.model");
const filterStatusHelper = require("../../helpers/filterStatus.helper");
const searchHelper = require("../../helpers/search.helper");
const paginationHelper = require("../../helpers/pagination.helper");
const createTreeHelper = require("../../helpers/createTree.helper");
const systemConfig = require("../../config/system");

module.exports.products = async (req, res) => {
    try {
        let findListProduct = {
            deleted: false,
        };

        //filterStatus
        const filterStatus = filterStatusHelper(req.query);
        if (req.query.status) {
            //req.query là trả ra các query trên url (?status="active") hoặc (?price=123)
            findListProduct.status = req.query.status;
        }
        //End filter status

        //Search
        const searchProducts = searchHelper(req.query);
        if (searchProducts.regex) {
            findListProduct.title = searchProducts.regex;
        }
        //End search

        //Pagination

        //Calculate Total Products
        const countProducts = await Product.countDocuments(findListProduct);

        const objectPagination = paginationHelper(
            {
                currentPage: 1,
                limitItem: 4,
            },
            req.query,
            countProducts
        );
        //End Pagination
        let sort = {};
        if (req.query.keySelect && req.query.keyValue) {
            sort[req.query.keySelect] = req.query.keyValue;
        } else {
            sort.position = "desc";
        }
        const products = await Product.find(findListProduct)
            .sort(sort)
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skip);

        for (const product of products) {
            const user = await Account.findOne({
                _id: product.createdBy.account_id,
            }).select("-password");

            if (user) {
                product.createdByFullName = user.fullName;
            }
        }
        //Phần render ra ngoài view
        res.render("admin/pages/products/index", {
            title: "Product",
            products: products,
            filterStatus: filterStatus,
            keyword: searchProducts.keyword,
            pagination: objectPagination,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

module.exports.changeStatus = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("products_edit")) {
            const status = req.params.status;
            const id = req.params.id;
            //History update
            let updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            };
            await Product.updateOne(
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
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

module.exports.changeMulti = async (req, res) => {
    try {
        const roleUser = res.locals.roleUser.permissions;
        if (
            roleUser.includes("products_edit") ||
            roleUser.includes("products_delete")
        ) {
            const type = req.body.type;
            const iDs = req.body.ids.split(", ");
            //History update
            let updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            };
            switch (type) {
                case "active":
                    if (roleUser.includes("products_edit")) {
                        await Product.updateMany(
                            { _id: { $in: iDs } },
                            {
                                status: "active",
                                $push: {
                                    updatedBy: updatedBy,
                                },
                            }
                        );
                        req.flash(
                            "success",
                            `Thay đổi trạng thái ${iDs.length} sản phẩm thành công!`
                        );
                    }
                    break;
                case "inactive":
                    if (roleUser.includes("products_edit")) {
                        await Product.updateMany(
                            { _id: { $in: iDs } },
                            {
                                status: "inactive",
                                $push: {
                                    updatedBy: updatedBy,
                                },
                            }
                        );
                        req.flash(
                            "success",
                            `Thay đổi trạng thái ${iDs.length} sản phẩm thành công!`
                        );
                    }
                    break;
                case "delete-all":
                    if (roleUser.includes("products_delete")) {
                        await Product.updateMany(
                            { _id: { $in: iDs } },
                            {
                                deleted: true,
                                deletedBy: {
                                    account_id: res.locals.user.id,
                                    deletedAt: new Date(),
                                },
                                $push: {
                                    updatedBy: updatedBy,
                                },
                            }
                        );
                        req.flash(
                            "success",
                            `Xóa ${iDs.length} sản phẩm thành công!`
                        );
                    }
                    break;
                case "update-position":
                    if (roleUser.includes("products_edit")) {
                        iDs.forEach(async (element) => {
                            const [id, position] = element.split("-");

                            await Product.updateOne(
                                { _id: id },
                                {
                                    position: parseInt(position),
                                    $push: {
                                        updatedBy: updatedBy,
                                    },
                                }
                            );
                        });
                        req.flash(
                            "success",
                            `Cập nhật vị trí ${iDs.length} sản phẩm thành công!`
                        );
                    }
                    break;
                default:
                    break;
            }
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

module.exports.create = async (req, res) => {
    try {
        //Get list categories
        const records = await ProductCategory.find({
            deleted: false,
        });
        const newRecords = createTreeHelper.tree(records);
        //End

        //Get list brands of category
        for (const item of records) {
            const brands = await Brand.find({
                _id: { $in: item.brands },
                deleted: false,
            }).select("_id name description");
            item.brands = brands;
        }
        //End

        res.render("admin/pages/products/create", {
            title: "Thêm mới sản phẩm",
            records: newRecords,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

module.exports.createProduct = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("products_create")) {
            //Format
            req.body.price = parseInt(req.body.price);
            req.body.discountPercentage = parseInt(req.body.discountPercentage);
            req.body.stock = parseInt(req.body.stock);
            req.body.color = JSON.parse(req.body.color);
            if (req.body.position == "") {
                const count = await Product.countDocuments({});
                req.body.position = count + 1;
            } else {
                req.body.position = parseInt(req.body.position);
            }
            //Create specifications product
            const productCategory = await ProductCategory.findOne({
                _id: req.body.parent_id,
                deleted: false,
            }).select("specifications features_spec");
            req.body.features_spec = productCategory.features_spec;
            req.body.specifications = productCategory.specifications;
            //History created
            let createdBy = {
                account_id: res.locals.user.id,
                createdAt: new Date(),
            };
            req.body.createdBy = createdBy;
            //End history created

            const product = new Product(req.body);
            product.save();
            req.flash("success", "Thêm sản phẩm thành công!");
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({
            _id: id,
            deleted: false,
        });

        const records = await ProductCategory.find({
            deleted: false,
        });
        const newRecords = createTreeHelper.tree(records);
        //Get list brands of category
        for (const item of records) {
            const brands = await Brand.find({
                _id: { $in: item.brands },
                deleted: false,
            }).select("_id name");
            item.brands = brands;
        }
        //End
        //Get brand of product
        const categoryOfProduct = await ProductCategory.findOne({
            _id: product.parent_id,
            deleted: false,
        });
        const brands = await Brand.find({
            _id: { $in: categoryOfProduct.brands },
            deleted: false,
        }).select("_id name");
        product.brands = brands;
        //End
        res.render("admin/pages/products/edit", {
            title: "Chỉnh sửa sản phẩm",
            product: product,
            records: newRecords,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

module.exports.editPatch = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("products_edit")) {
            const id = req.params.id;
            req.body.price = parseInt(req.body.price);
            req.body.discountPercentage = parseInt(req.body.discountPercentage);
            req.body.stock = parseInt(req.body.stock);
            req.body.position = parseInt(req.body.position);
            req.body.color = JSON.parse(req.body.color);
            //History updated
            let updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            };
            const product = await Product.findOne({
                _id: id,
                deleted: false,
            });
            const categoryParent = await ProductCategory.findOne({
                _id: req.body.parent_id,
            });

            if (product.parent_id != req.body.parent_id) {
                await Product.updateOne(
                    { _id: id },
                    {
                        features_spec: [],
                        specifications: [],
                    }
                );
                await Product.updateOne(
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
            await Product.updateOne(
                { _id: id },
                {
                    ...req.body,
                    $push: {
                        updatedBy: updatedBy,
                    },
                }
            );

            req.flash("success", "Sửa sản phẩm thành công!");
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

module.exports.deleteProduct = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("products_delete")) {
            const id = req.params.id;
            await Product.updateOne(
                { _id: id },
                {
                    deleted: true,
                    deletedBy: {
                        account_id: res.locals.user.id,
                        deletedAt: new Date(),
                    },
                }
            );
            req.flash("success", "Xóa sản phẩm thành công!");
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

module.exports.detail = async (req, res) => {
    // try {
    const id = req.params.id;
    const product = await Product.findOne({
        _id: id,
        deleted: false,
    });
    //History create product
    if (product.createdBy) {
        const user = await Account.findOne({
            _id: product.createdBy.account_id,
        }).select("fullName");
        if (user) {
            product.createdByFullName = user.fullName;
        }
    }
    //History update product
    if (product.updatedBy.length > 0) {
        const user = await Account.findOne({
            _id: product.updatedBy[product.updatedBy.length - 1].account_id,
        }).select("fullName");
        if (user) {
            product.fullNameUpdated = user.fullName;
        }
    }
    //Get category
    const productCategory = await ProductCategory.findOne({
        _id: product.parent_id,
    }).select("title");
    product.productCategory = productCategory.title;
    //Get brand
    const brand = await Brand.findOne({
        _id: product.brand_id,
    }).select("name");
    if (brand) {
        product.brand = brand.name;
    }
    res.render("admin/pages/products/detail", {
        title: "Chi tiết sản phẩm",
        product: product,
    });
    // } catch (error) {
    //     res.redirect(`${systemConfig.prefixAdmin}/products`);
    // }
};

module.exports.specification = async (req, res) => {
    try {
        const id = req.params.id;
        let findOneProduct = {
            _id: id,
            deleted: false,
        };
        const product = await Product.findOne(findOneProduct);
        res.render("admin/pages/products/specification/index", {
            title: "Thông số sản phẩm",
            product: product,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

module.exports.createSpecificationPost = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("products_create")) {
            const name = req.body.nameSpec;
            const value = req.body.valueDefault;
            if (name && value) {
                const product = await Product.findOne({
                    _id: req.params.id,
                    deleted: false,
                }).select("specifications");
                //check name spec exists
                const existsSpec = product.specifications.find(
                    (element) => element.nameSpec == name
                );
                if (existsSpec) {
                    req.flash("error", "Thông số đã tồn tại!");
                } else {
                    let updatedBy = {
                        account_id: res.locals.user.id,
                        updatedAt: new Date(),
                    };
                    await Product.updateOne(
                        {
                            _id: req.params.id,
                        },
                        {
                            $push: {
                                specifications: req.body,
                                updatedBy: updatedBy,
                            },
                        }
                    );
                    req.flash("success", "Thêm thành công!");
                }
            } else {
                req.flash("error", "Vui lòng nhập thông số!");
            }
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

module.exports.createFeaturesSpecPost = async (req, res) => {
    try {
        if (res.locals.roleUser.permissions.includes("products_create")) {
            const name = req.body.nameFeaturesSpec;
            const value = req.body.valueDefault;
            if (name && value) {
                const product = await Product.findOne({
                    _id: req.params.id,
                    deleted: false,
                }).select("features_spec");
                //check name spec exists
                const existsSpec = product.features_spec.find(
                    (element) => element.nameFeaturesSpec == name
                );
                if (existsSpec) {
                    req.flash("error", "Thông số đã tồn tại!");
                } else {
                    let updatedBy = {
                        account_id: res.locals.user.id,
                        updatedAt: new Date(),
                    };
                    await Product.updateOne(
                        {
                            _id: req.params.id,
                        },
                        {
                            $push: {
                                features_spec: req.body,
                                updatedBy: updatedBy,
                            },
                        }
                    );
                    req.flash("success", "Thêm thành công!");
                }
            } else {
                req.flash("error", "Vui lòng nhập thông số!");
            }
            res.redirect("back");
        } else {
            return;
        }
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

module.exports.editSpecification = async (req, res) => {
    try {
        const idProduct = req.params.idProduct;
        const idSpec = req.params.idSpec;
        const product = await Product.findOne({
            _id: idProduct,
            deleted: false,
        });
        const specProduct = product.specifications.find((element) => {
            if (element.id == idSpec) {
                return element;
            }
        });
        res.render("admin/pages/products/specification/edit", {
            title: "Chỉnh sửa sản phẩm",
            product: product,
            specProduct: specProduct,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

module.exports.editSpecificationPatch = async (req, res) => {
    try {
        const role = res.locals.roleUser.permissions;
        if (
            role.includes("products_edit") ||
            role.includes("products_create")
        ) {
            const idProduct = req.params.idProduct;
            const idSpec = req.params.idSpec;
            //History updated
            let updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            };
            await Product.updateOne(
                {
                    _id: idProduct,
                    "specifications._id": idSpec,
                },
                {
                    $set: {
                        "specifications.$.nameSpec": req.body.nameSpec,
                        "specifications.$.valueDefault": req.body.valueDefault,
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
        const idProduct = req.params.idProduct;
        const idSpec = req.params.idSpec;
        const product = await Product.findOne({
            _id: idProduct,
            deleted: false,
        });
        let featureSpec = {};
        for (const item of product.features_spec) {
            if (item.id == idSpec) {
                featureSpec.id = item.id;
                featureSpec.nameFeaturesSpec = item.nameFeaturesSpec;
                featureSpec.valueDefault = item.valueDefault;
            }
        }
        res.render("admin/pages/products/specification/edit-features", {
            title: "Chỉnh sửa sản phẩm",
            product: product,
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
            role.includes("products_edit") ||
            role.includes("products_create")
        ) {
            const idProduct = req.params.idProduct;
            const idSpec = req.params.idSpec;
            //History updated
            let updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            };
            await Product.updateOne(
                {
                    _id: idProduct,
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
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

module.exports.deleteSpecification = async (req, res) => {
    try {
        const role = res.locals.roleUser.permissions;
        if (role.includes("products_edit")) {
            const idProduct = req.params.idProduct;
            const idSpec = req.params.idSpec;
            let updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            };
            await Product.updateOne(
                { _id: idProduct },
                {
                    $pull: {
                        specifications: { _id: idSpec },
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

module.exports.deleteFeaturesSpec = async (req, res) => {
    try {
        const role = res.locals.roleUser.permissions;
        if (role.includes("products_edit")) {
            const idProduct = req.params.idProduct;
            const idSpec = req.params.idSpec;
            let updatedBy = {
                account_id: res.locals.user.id,
                updatedAt: new Date(),
            };
            await Product.updateOne(
                { _id: idProduct },
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

module.exports.uploadImageProduct = async (req, res) => {
    try {
        const id = req.params.idProduct;
        res.render("admin/pages/products/upload", {
            title: "Products",
            idProduct: id,
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};

module.exports.uploadImageProductPost = async (req, res) => {
    try {
        const id = req.params.idProduct;
        await Product.updateOne(
            {
                _id: id,
            },
            {
                listImage: req.body.listImage,
            }
        );
        req.flash("success", "Thêm ảnh thành công!");
        res.redirect("back");
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
};
//Viết ghi chú cho các thư viện
//Làm tính năng xóa hình ảnh muốn upload
//Change try catch because it is infinite loop
//Tạo hình thùng rác bên trang sản phẩm (có 1 hình deco hiển thị số sản phẩm đã bị xóa)
