const BaseRepository = require("./BaseRepository");

class LegacyTreeRepository extends BaseRepository {
    constructor(session) {
        super("trees", session);
        this._tableName = "trees";
        this._session = session;
    }

    async save(tree) {
        return await super.create(tree);
    }
}

module.exports = { LegacyTreeRepository };
