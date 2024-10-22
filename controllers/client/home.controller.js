const Product = require("../../models/product.model");
const Brand = require("../../models/brand.model");
const ProductCategory = require("../../models/product-category.model");
const productHelper = require("../../helpers/product.helper");
const Blog = require("../../models/blog.model");
const BlogCategory = require("../../models/blog-category.model");

module.exports.home = async (req, res) => {
    const productCategory = await ProductCategory.find({
        parent_id: "",
        status: "active",
        deleted: false,
    }).sort({ position: "asc" });

    let optionsCategory = [
        "laptop-gaming",
        "laptop-van-phong",
        "chuot",
        "pc-gvn",
        "man-hinh",
        "ban-phim",
    ];

    const getProductFromCategory = await ProductCategory.find({
        slug: { $in: optionsCategory },
        deleted: false,
        status: "active",
    });
    // console.log(getProductFromCategory);
    //Get brands of laptop gaming vs laptop van phong
    for (const item of getProductFromCategory) {
        const brands = await Brand.find({
            _id: { $in: item.brands },
            deleted: false,
        });
        item.brandOptions = brands;
    }
    //End
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
    for (const item of getProductFromCategory) {
        const listSubCategory = await getSubCategory(item.id);
        const listIdSubCategory = listSubCategory.map((element) => element.id);

        const products = await Product.find({
            parent_id: {
                $in: [item.id, ...listIdSubCategory],
            },
            deleted: false,
            status: "active",
        })
            .sort({ position: "desc" })
            .limit(10);
        const newProduct = productHelper.newPriceProduct(products);
        item.products = newProduct;
    }

    //Blogs
    const blogCategoy = await BlogCategory.findOne({
        slug: "tin-tuc-cong-nghe",
        deleted: false,
        status: "active",
    });

    const getSubCategoryBlog = async (id) => {
        let allSubs = [];

        const listSub = await BlogCategory.find({
            parent_id: id,
            deleted: false,
            status: "active",
        }).select("id title");

        allSubs = [...listSub];

        for (const sub of listSub) {
            const childs = await getSubCategoryBlog(sub.id);
            allSubs = allSubs.concat(childs);
        }

        return allSubs;
    };

    const listSubCategory = await getSubCategoryBlog(blogCategoy.id);
    // console.log(blogCategoy.id);
    const listIdSubCategory = listSubCategory.map((item) => item.id);

    const blogs = await Blog.find({
        parent_id: { $in: [blogCategoy.id, ...listIdSubCategory] },
        deleted: false,
        status: "active",
    })
        .sort({ position: "desc" })
        .limit(4);
    //End Blogs

    res.render("client/pages/home/index", {
        title: "Trang chủ",
        getProductFromCategory: getProductFromCategory,
        productCategory: productCategory,
        blogs: blogs,
    });
};
