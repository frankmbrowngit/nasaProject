const DEFAULT_PAGE_LIMIT = 0;
const DEFAULT_PAGE_NUMBER = 1;
function getPagination(query) {
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT; // when limit is zero, mongo returns all
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const skip = (page-1)*limit;
    return {
        skip,
        limit
    }
}

module.exports = {
    getPagination
}