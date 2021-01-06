/**
 * This is a temporary model that allows to replicate data from field data schema to the
 * treetracker database for backward compatability while the breakdown/migration of monolith
 * db is in process. It can be removed at appropriate time when the dependencies on
 * legacy tables in treetracker main db is bound to its relevant contexts. For e.g, tree_attributes
 * is really capture_metadata and has to be owned by a future capture service context and the current
 * trees table in treetracker db is really a tree capture table and do not represent a unique tree..
 */
const { Repository } = require('./Repository');
const LegacyTree = ({ id, image_url, lat, lon, planter_id, planter_identifier }) => Object.freeze({
    uuid: id,
    image_url,
    lat,
    lon,
    planter_id,
    planter_identifier,
    time_created: new Date().toISOString(),
    time_updated: new Date().toISOString(),
})
const createTreesInMainDB = (legacyTreeRepositoryImpl) => (async (tree) => {
    const legacyTree = { uuid: tree.id, ...tree };
    const legacyTreeRepository = new Repository(legacyTreeRepositoryImpl);
    const result = await legacyTreeRepository.save(legacyTree);
    return { entity: result, raisedEvents: [] };
})

module.exports = { createTreesInMainDB, LegacyTree };