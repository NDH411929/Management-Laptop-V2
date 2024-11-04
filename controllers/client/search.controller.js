const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const productHelper = require("../../helpers/product.helper");
const searchHelper = require("../../helpers/search.helper");
module.exports.search = async (req, res) => {
    try {
        const searchProducts = searchHelper(req.query);
        const keyword = req.query.keyword;
        const products = await Product.find({
            title: searchProducts.regex,
            status: "active",
            deleted: false,
        });
        const newProduct = productHelper.newPriceProduct(products);
        //Get list category
        const listProductCategory = await ProductCategory.find({
            status: "active",
            deleted: false,
        });

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

        res.render("client/pages/search/index", {
            title: "Sản phẩm",
            products: newProduct,
            keyword: keyword,
            listProductCategory: listProductCategory,
        });
    } catch (error) {
        res.redirect("/");
    }
};
