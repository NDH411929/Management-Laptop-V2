module.exports = (objectPagination, query, countProducts) => {
    //GET Present Page
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }

    //Caculate Skip Products
    objectPagination.skip =
        (objectPagination.currentPage - 1) * objectPagination.limitItem;

    //Round Total Pages
    const totalPages = Math.ceil(countProducts / objectPagination.limitItem);
    objectPagination.totalPages = totalPages;

    return objectPagination;
};
