module.exports.getReviews = (evaluate) => {
    let reviews = {
        star_1: 0,
        star_2: 0,
        star_3: 0,
        star_4: 0,
        star_5: 0,
    };
    for (const item of evaluate) {
        item.value == 1 ? (reviews.star_1 += 1) : (reviews.star_1 += 0);
        item.value == 2 ? (reviews.star_2 += 1) : (reviews.star_2 += 0);
        item.value == 3 ? (reviews.star_3 += 1) : (reviews.star_3 += 0);
        item.value == 4 ? (reviews.star_4 += 1) : (reviews.star_4 += 0);
        item.value == 5 ? (reviews.star_5 += 1) : (reviews.star_5 += 0);
    }
    return reviews;
};
