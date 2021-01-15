class Repository {

    constructor(repoImpl) {
        this.repoImpl = repoImpl;
    }

    async save(data) {
        return await this.repoImpl.save(data);
    }

    async getByFilter(filterCriteria, options) {
        return await this.repoImpl.getByFilter(filterCriteria, options);
    }
}

module.exports = { Repository };