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

class LegacyTreeAttributeRepository extends BaseRepository {
    constructor(session) {
        super("tree_attributes", session);
        this._tableName = "tree_attributes";
        this._session = session;
    }

    async save(tree_attributes) {
        tree_attributes.forEach(attribute => {
            super.create(attribute);
        });
    }
}

module.exports = { LegacyTreeAttributeRepository, LegacyTreeRepository };