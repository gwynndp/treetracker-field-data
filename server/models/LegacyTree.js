/**
 * This is a temporary model that allows to replicate data from field data schema to the
 * treetracker database for backward compatability while the breakdown/migration of monolith
 * db is in process. It can be removed at appropriate time when the dependencies on
 * legacy tables in treetracker main db is bound to its relevant contexts. For e.g, tree_attributes
 * is really capture_metadata and has to be owned by a future capture service context and the current
 * trees table in treetracker db is really a tree capture table and do not represent a unique tree..
 */
const HttpError = require('../handlers/HttpError');
const { Repository } = require('./Repository');
const LegacyPlanterRepository = require('../infra/database/LegacyPlanterRepository');

const LegacyTree = async ({
  id,
  image_url,
  lat,
  lon,
  device_identifier = null,
  wallet = null,
  user_photo_url = null,
  note = '',
  capture_taken_at,
  session,
}) => {
  const legacyPlanterRepo = new LegacyPlanterRepository(session);
  const planter = await legacyPlanterRepo.findUser(wallet);

  if (!planter)
    throw new HttpError(
      422,
      'Legacy planter has not been created for the legacy tree',
    );

  return Object.freeze({
    uuid: id,
    image_url,
    lat,
    lon,
    planter_id: planter.id,
    planter_identifier: wallet,
    planter_photo_url: user_photo_url,
    device_identifier,
    note,
    time_created: capture_taken_at,
    time_updated: capture_taken_at,
  });
};

const createTreesInMainDB = (
  legacyTreeRepoImpl,
  legacyTreeAttrRepoImpl,
) => async (tree, attributes) => {
  const legacyTreeRepository = new Repository(legacyTreeRepoImpl);
  const legacyAttributesRepository = new Repository(legacyTreeAttrRepoImpl);
  const result = await legacyTreeRepository.add(tree);
  const tree_attributes = attributes.map((attribute) => ({
    tree_id: result.id,
    ...attribute,
  }));
  await legacyAttributesRepository.add(tree_attributes);
  return { entity: result, raisedEvents: [] };
};

module.exports = { createTreesInMainDB, LegacyTree };
