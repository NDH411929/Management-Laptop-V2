module.exports.newPriceProduct = (products) => {
    const newProduct = products.map((item) => {
        item.priceNew = (
            (1 - item.discountPercentage / 100) *
            item.price
        ).toFixed(2);
        return item;
    });
    return newProduct;
};
