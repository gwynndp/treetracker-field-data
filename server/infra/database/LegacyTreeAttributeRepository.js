const BaseRepository = require('./BaseRepository');

class LegacyTreeAttributeRepository extends BaseRepository {
  constructor(session) {
    super('tree_attributes', session);
    this._tableName = 'tree_attributes';
    this._session = session;
  }

  async add(tree_attributes) {
    await Promise.all(
      tree_attributes.map(async (attribute) => {
        await super.create(attribute);
      }),
    );
  }
}

module.exports = LegacyTreeAttributeRepository;
