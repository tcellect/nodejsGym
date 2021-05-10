class APIfeatures {
  // queryObj exprects Tour
  // queryString expects query parameters
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // BUILD QUERY
  filter() {
    const query = { ...this.queryString };

    // delete reserved keys from a query
    const fieldsToExclude = ["page", "sort", "limit", "fields"];
    fieldsToExclude.forEach((el) => delete query[el]);
    let queryS = JSON.stringify(query);

    //adjust for mongo format
    queryS = queryS.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryS));
    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      const getFields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(getFields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  pagination() {
    const page = this.queryString * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const sk = (page - 1) * limit;
    this.query = this.query.skip(sk).limit(limit);

    if (this.queryString.page) {
      const numTours = this.query.countDocuments();
      if (page >= numTours) {
        throw new Error("no such page");
      }
    }
    return this;
  }
}

module.exports = APIfeatures;
