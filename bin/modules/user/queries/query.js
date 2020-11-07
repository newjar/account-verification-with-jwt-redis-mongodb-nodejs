class Query {
  constructor(db) {
    this.db = db;
  }

  async findOneUser(parameter) {
    this.db.setCollection('user');
    const result = await this.db.findOne(parameter);
    return result;
  }
}

module.exports = Query;
