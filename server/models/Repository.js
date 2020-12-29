class Repository {

    constructor(impl) {
        this.impl = impl;
    }

    async save(data) {
        return await this.impl.save(data);
    }
}

module.exports = { Repository };