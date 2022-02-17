const BaseRepository = require('./BaseRepository');

class LegacyTreeRepository extends BaseRepository {
  constructor(session) {
    super('trees', session);
    this._tableName = 'trees';
    this._session = session;
  }

  async add(tree) {
    console.log('tree', tree);
    // Since the query uses postgres function ST_PointFromText, knex raw function is used
    const geometry = 'POINT( ' + tree.lon + ' ' + tree.lat + ')';
    const result = await this._session.getDB().raw(
      `insert into trees (
              planter_id,
              lat,
              lon,
              estimated_geometric_location,
              time_created,
              time_updated,
              planter_photo_url,
              planter_identifier,
              device_identifier, 
              note,
              uuid,
              image_url
          )
          values(?, ?, ?, ST_PointFromText(?, 4326), ?, ?, ?, ?, ?, ?, ?, ?)
          returning id`,
      [
        tree.planter_id,
        tree.lat,
        tree.lon,
        geometry,
        tree.time_created,
        tree.time_updated,
        tree.planter_photo_url,
        tree.planter_identifier,
        tree.device_identifier,
        tree.note,
        tree.uuid,
        tree.image_url,
      ],
    );
    return await result.rows[0];
  }
}

module.exports = LegacyTreeRepository;
