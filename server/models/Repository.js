class Repository {

    constructor(repoImpl) {
        this.repoImpl = repoImpl;
    }

    async save(data) {
        return await this.repoImpl.save(data);
    }
}

module.exports = { Repository };