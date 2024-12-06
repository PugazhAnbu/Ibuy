class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    let keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryStrCopy = { ...this.queryStr };

    //removing fields from query
    const removeFields = ["keyword", "limit", "page"];
    //The delete operator removes a given property from an object
    removeFields.forEach((field) => delete queryStrCopy[field]);

    let querystr = JSON.stringify(queryStrCopy);
    querystr = querystr.replace(/\b(gt|gte|lt|lte)/gi, (match) => `$${match}`);

    this.query.find(JSON.parse(querystr));
    return this;
  }

  paginate(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    this.query.limit(resPerPage).skip(skip);
    //Idhuku aprm intha class oda object return panrom
    return this;
  }
}

module.exports = APIFeatures;
