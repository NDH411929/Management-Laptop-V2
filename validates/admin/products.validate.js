module.exports.createPost = (req, res, next) => {
    const stock = parseInt(req.body.stock);
    const price = parseInt(req.body.price);
    const description = req.body.description;
    if (!req.body.title) {
        req.flash("error", "Vui lòng nhập tiêu đề cho sản phẩm!");
        res.redirect("back");
        return;
    }
    if (description.length <= 5) {
        req.flash("error", "Mô tả phải có ít nhất 5 kí tự!");
        res.redirect("back");
        return;
    }
    if (price <= 0) {
        req.flash("error", "Giá sản phẩm phải lớn hơn 0!");
        res.redirect("back");
        return;
    }
    if (stock <= 0) {
        req.flash("error", "Số lượng sản phẩm phải lớn hơn 0!");
        res.redirect("back");
        return;
    }
    next();
};
