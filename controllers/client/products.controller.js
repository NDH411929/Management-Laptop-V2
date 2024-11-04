const Product = require("../../models/product.model");
const Brand = require("../../models/brand.model");
const Blog = require("../../models/blog.model");
const User = require("../../models/user.model");
const ProductCategory = require("../../models/product-category.model");
const productHelper = require("../../helpers/product.helper");
const filterSpec = require("../../helpers/filterSpec.helper");
const sortHelper = require("../../helpers/sort.helper");
const reviewsHelper = require("../../helpers/reviews.helper");
const Evaluate = require("../../models/evaluate.model");

module.exports.products = async (req, res) => {
    try {
        //Get list product sort by position
        const products = await Product.find({
            status: "active",
            deleted: false,
        }).sort({ position: "desc" });

        const { sort_by, ...queryUser } = req.query;
        //Check exists sort_by
        if (Object.keys(queryUser).includes("sort_by")) {
            //Delete sort_by
            delete queryUser.sort_by;
        }

        //Get list category
        const listProductCategory = await ProductCategory.find({
            status: "active",
            deleted: false,
        });

        //Get all sub category in parent category
        const getAllProductCategory = async (categoryId, arr) => {
            const child = await ProductCategory.find({
                parent_id: categoryId,
                status: "active",
                deleted: false,
            });
            for (const item of child) {
                arr.push(item.id);
                await getAllProductCategory(item.id, arr);
            }
        };

        for (const item of listProductCategory) {
            const count = await Product.countDocuments({
                parent_id: item.id,
                status: "active",
                deleted: false,
            });
            item.count = count;
        }

        for (const item of listProductCategory) {
            let listSubCategoryId = [];
            await getAllProductCategory(item.id, listSubCategoryId);
            if (listSubCategoryId.length > 0) {
                let totalCount = await Product.countDocuments({
                    parent_id: item.id,
                    status: "active",
                    deleted: false,
                });
                for (const id of listSubCategoryId) {
                    const count = await Product.countDocuments({
                        parent_id: id,
                        status: "active",
                        deleted: false,
                    });
                    totalCount += count;
                }
                item.totalCount = totalCount;
            } else {
                const totalCount = await Product.countDocuments({
                    parent_id: item.id,
                    status: "active",
                    deleted: false,
                });
                item.totalCount = totalCount;
            }
        }

        //Get filter user choose
        const arrFilter = filterSpec.filterUserChoosed(queryUser, products);
        //End Get filter user choose

        //Filter products
        let newProducts = [];
        if (Object.keys(queryUser).length) {
            if (Object.keys(queryUser).length > 1) {
                newProducts = filterSpec.filterMultiSpec(queryUser, products);
            } else {
                newProducts = filterSpec.filterSpec(queryUser, products);
            }
        } else {
            newProducts = products;
        }
        //End filter products

        //Create new price product
        const newProduct = productHelper.newPriceProduct(newProducts);

        //Get name & value filter
        let arrObj = filterSpec.getNameFilter(products);

        //Sort
        if (req.query.sort_by) {
            const [key, value] = req.query.sort_by.split("-");
            sortHelper.sortedClient(key, value, newProduct);
        }
        //End Sort

        res.render("client/pages/products/index", {
            title: "Sản phẩm",
            products: newProduct,

            listProductCategory: listProductCategory,
            filterSpec: arrObj,
            arrFilter: arrFilter,
        });
    } catch (error) {
        res.redirect("/");
    }
};

module.exports.category = async (req, res) => {
    try {
        //Get one category
        const productCategory = await ProductCategory.findOne({
            slug: req.params.slugCategory,
            status: "active",
            deleted: false,
        });

        //Get list category
        const listProductCategory = await ProductCategory.find({
            status: "active",
            deleted: false,
        });

        //Get all sub category in parent category
        let listSubCategoryId = [];
        const getAllProductCategory = async (categoryId, arr) => {
            const child = await ProductCategory.find({
                parent_id: categoryId,
                status: "active",
                deleted: false,
            });
            for (const item of child) {
                arr.push(item.id);
                await getAllProductCategory(item.id, arr);
            }
        };
        await getAllProductCategory(productCategory.id, listSubCategoryId);

        for (const item of listProductCategory) {
            const count = await Product.countDocuments({
                parent_id: item.id,
                status: "active",
            });
            item.count = count;
        }

        for (const item of listProductCategory) {
            let listSubCategoryId = [];
            await getAllProductCategory(item.id, listSubCategoryId);
            if (listSubCategoryId.length > 0) {
                let totalCount = await Product.countDocuments({
                    parent_id: item.id,
                    status: "active",
                    deleted: false,
                });
                for (const id of listSubCategoryId) {
                    const count = await Product.countDocuments({
                        parent_id: id,
                        status: "active",
                        deleted: false,
                    });
                    totalCount += count;
                }
                item.totalCount = totalCount;
            } else {
                const totalCount = await Product.countDocuments({
                    parent_id: item.id,
                    status: "active",
                    deleted: false,
                });
                item.totalCount = totalCount;
            }
        }

        //Get products in category
        const products = await Product.find({
            parent_id: { $in: [productCategory.id, ...listSubCategoryId] },
            status: "active",
            deleted: false,
        }).sort({ position: "desc" });

        const { sort_by, ...queryUser } = req.query;
        //Check exists sort_by
        if (Object.keys(queryUser).includes("sort_by")) {
            //Delete sort_by
            delete queryUser.sort_by;
        }

        //Get filter user choose
        const arrFilter = filterSpec.filterUserChoosed(queryUser, products);
        //End Get filter user choose

        //Filter products
        let newProducts = [];
        if (Object.keys(queryUser).length) {
            if (Object.keys(queryUser).length > 1) {
                newProducts = filterSpec.filterMultiSpec(queryUser, products);
            } else {
                newProducts = filterSpec.filterSpec(queryUser, products);
            }
        } else {
            newProducts = products;
        }
        //End filter products

        //Create new price product
        const newProduct = productHelper.newPriceProduct(newProducts);

        //Get name features specifications
        let arrObj = filterSpec.getNameFilter(products);

        //Sort
        if (req.query.sort_by) {
            const [key, value] = req.query.sort_by.split("-");
            sortHelper.sortedClient(key, value, newProduct);
        }
        //End Sort

        const listBrand = await Brand.find({
            _id: { $in: productCategory.brands },
            status: "active",
            deleted: false,
        });

        productCategory.listBrand = listBrand;

        res.render("client/pages/products/index", {
            title: productCategory.title,
            products: newProduct,
            category: productCategory,
            listProductCategory: listProductCategory,
            filterSpec: arrObj,
            arrFilter: arrFilter,
        });
    } catch (error) {
        res.redirect("/");
    }
};

module.exports.brandOfCategory = async (req, res) => {
    try {
        const slugCategory = req.params.slugCategory;
        const slugBrand = req.params.slugBrand;
        const brand = await Brand.findOne({
            slug: slugBrand,
            deleted: false,
        });
        const category = await ProductCategory.findOne({
            slug: slugCategory,
            deleted: false,
            status: "active",
        });

        const getSubCategory = async (parent_id) => {
            let allSubs = [];

            const listSub = await ProductCategory.find({
                parent_id: parent_id,
                deleted: false,
                status: "active",
            }).select("id title");

            allSubs = [...listSub];

            for (const sub of listSub) {
                const childs = await getSubCategory(sub.id);
                allSubs = allSubs.concat(childs);
            }

            return allSubs;
        };

        const listSubCategory = await getSubCategory(category.id);
        const listIdSubCategory = listSubCategory.map((item) => item.id);

        const products = await Product.find({
            parent_id: { $in: [category.id, ...listIdSubCategory] },
            brand_id: brand.id,
            deleted: false,
            status: "active",
        }).sort({ position: "desc" });

        const { sort_by, ...queryUser } = req.query;
        //Check exists sort_by
        if (Object.keys(queryUser).includes("sort_by")) {
            //Delete sort_by
            delete queryUser.sort_by;
        }

        for (const item of products) {
            item.priceNew = (
                (item.price * (100 - item.discountPercentage)) /
                100
            ).toFixed(0);
        }

        //Filter products
        let newProducts = [];
        if (Object.keys(queryUser).length) {
            if (Object.keys(queryUser).length > 1) {
                newProducts = filterSpec.filterMultiSpec(queryUser, products);
            } else {
                newProducts = filterSpec.filterSpec(queryUser, products);
            }
        } else {
            newProducts = products;
        }
        //End filter products

        //Filter Spec
        let arrObj = filterSpec.getNameFilter(products);

        //Get filter user choose
        const arrFilter = filterSpec.filterUserChoosed(queryUser, products);
        //End Get filter user choose

        //Sort
        if (req.query.sort_by) {
            const [key, value] = req.query.sort_by.split("-");
            sortHelper.sortedClient(key, value, newProducts);
        }
        //End Sort
        const productCategory = await ProductCategory.findOne({
            slug: req.params.slugCategory,
            status: "active",
            deleted: false,
        });

        //Get brand
        const listBrand = await Brand.find({
            _id: { $in: productCategory.brands },
            status: "active",
            deleted: false,
        });

        productCategory.listBrand = listBrand;
        //End Get brand
        const keyword = req.params.slugBrand;

        res.render("client/pages/products/index", {
            title: "Product",
            products: newProducts,
            filterSpec: arrObj,
            keyword: keyword,
            category: productCategory,
            arrFilter: arrFilter,
        });
    } catch (error) {
        res.redirect("/");
    }
};

// module.exports.brand = async (req, res) => {
//     try {
//         //Get one category
//         const brand = await Brand.findOne({
//             slug: req.params.slug,
//             deleted: false,
//         });

//         const products = await Product.find({
//             brand_id: brand.id,
//             deleted: false,
//         });

//         //Filter products
//         let newProducts = [];
//         if (Object.keys(req.query).length) {
//             if (Object.keys(req.query).length > 1) {
//                 newProducts = filterSpec.filterMultiSpec(req.query, products);
//             } else {
//                 newProducts = filterSpec.filterSpec(req.query, products);
//             }
//         } else {
//             newProducts = products;
//         }
//         //End filter products

//         //Create new price product
//         const newProduct = productHelper.newPriceProduct(newProducts);

//         let arrName = [];
//         for (const item of products) {
//             for (const i of item.features_spec) {
//                 if (!arrName.includes(i.nameFeaturesSpec)) {
//                     arrName.push(i.nameFeaturesSpec);
//                 }
//             }
//             item.priceOld = item.price.toFixed(2);
//         }
//         let arrObj = [];
//         for (const item of arrName) {
//             let obj = {
//                 name: "",
//                 value: [],
//             };
//             obj.name = item;
//             for (const i of products) {
//                 for (const k of i.features_spec) {
//                     if (
//                         item == k.nameFeaturesSpec &&
//                         !obj.value.includes(k.valueDefault)
//                     ) {
//                         obj.value.push(k.valueDefault);
//                     }
//                 }
//             }
//             arrObj.push(obj);
//         }

//         //Get filter user choose
//         let arrFilter = [];
//         for (var k = 0; k < Object.keys(req.query).length; k++) {
//             let object = {};
//             for (const item of products) {
//                 for (const i of item.features_spec) {
//                     if (
//                         i.nameFeaturesSpec.toLowerCase().replace(/\s+/g, "") ==
//                             Object.keys(req.query)[k] &&
//                         i.valueDefault.toLowerCase().replace(/\s+/g, "") ==
//                             Object.values(req.query)[k]
//                     ) {
//                         object.name = i.nameFeaturesSpec;
//                         object.value = i.valueDefault;
//                     }
//                 }
//             }
//             arrFilter.push(object);
//         }
//         //End Get filter user choose

//         res.render("client/pages/products/index", {
//             title: "Product",
//             products: newProduct,
//             filterSpec: arrObj,
//             arrFilter: arrFilter,
//         });
//     } catch (error) {
//         res.redirect("/404");
//     }
// };

module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slugProduct;
        const product = await Product.findOne({
            slug: slug,
            deleted: false,
        });
        //Get reviews of product
        const evaluate = await Evaluate.findOne({
            product_id: product.id,
        });
        if (evaluate) {
            const reviews = reviewsHelper.getReviews(evaluate.rate);
            product.reviews = reviews;
            let sum = evaluate.rate
                .reduce(
                    (accumulator, currentValue) =>
                        accumulator + currentValue.value,
                    0
                )
                .toFixed(1);
            const average = sum / evaluate.rate.length;
            product.average = average;
        }

        //Get category of product
        const productCategory = await ProductCategory.findOne({
            _id: product.parent_id,
            deleted: false,
            status: "active",
        });
        product.category = productCategory;
        product.priceNew = (
            (1 - product.discountPercentage / 100) *
            product.price
        ).toFixed(2);

        //Get product of category
        const listProduct = await Product.find({
            parent_id: product.parent_id,
            status: "active",
            deleted: false,
        }).limit(3);
        const newListProduct = productHelper.newPriceProduct(listProduct);

        //Get blog of category
        const blog = await Blog.find({
            status: "active",
            deleted: false,
        }).limit(3);

        res.render("client/pages/products/detail", {
            title: "Chi tiết sản phẩm",
            product: product,
            blog: blog,
            listProduct: newListProduct,
        });
    } catch (error) {
        res.redirect("/");
    }
};

module.exports.sendEvaluate = async (req, res) => {
    try {
        const slug = req.params.slugProduct;
        const tokenUser = req.cookies.tokenUser;
        const product = await Product.findOne({
            slug: slug,
            deleted: false,
        });
        const user = await User.findOne({
            tokenUser: tokenUser,
        });
        const existsEvaluate = await Evaluate.findOne({
            product_id: product.id,
        });
        const value = parseInt(req.body.value);
        if (value > 5 || value < 1) {
            req.flash("error", "Lỗi!");
            return;
        }
        if (!existsEvaluate) {
            const object = {
                product_id: product.id,
                rate: [
                    {
                        user_id: user.id,
                        value: value,
                        description: req.body.description,
                    },
                ],
            };
            const evaluate = new Evaluate(object);
            await evaluate.save();
        } else {
            const objectRate = {
                user_id: user.id,
                value: value,
                description: req.body.description,
            };
            let check = "false";
            for (const item of existsEvaluate.rate) {
                if (item.user_id == user.id) {
                    check = "true";
                }
            }
            if (check == "false") {
                await Evaluate.updateOne(
                    {
                        product_id: product.id,
                    },
                    {
                        $push: {
                            rate: objectRate,
                        },
                    }
                );
            } else {
                await Evaluate.updateOne(
                    {
                        product_id: product.id,
                        "rate.user_id": user.id,
                    },
                    {
                        $set: {
                            "rate.$.value": value,
                            "rate.$.description": req.body.description,
                        },
                    }
                );
            }
        }
        req.flash("success", "Đánh giá thành công!");
        res.redirect("back");
    } catch (error) {
        res.redirect("/");
    }
};
