module.exports = (query) => {
    let objectSearch = {
        keyword: "",
        regex: "",
    };
    if (query.keyword) {
        objectSearch.keyword = query.keyword;
        //Sử dụng regex để tối ưu chức năng tìm kiếm
        const regex = new RegExp(objectSearch.keyword, "i"); //"i" là không phân biệt hoa thường
        objectSearch.regex = regex;
    }
    return objectSearch;
};
