/**
 * This is a temporary model that allows to replicate data from field data schema to the
 * treetracker database for backward compatability while the breakdown/migration of monolith
 * db is in process. It can be removed at appropriate time when the dependencies on
 * legacy tables in treetracker main db is bound to its relevant contexts. For e.g, tree_attributes
 * is really capture_metadata and has to be owned by a future capture service context and the current
 * trees table in treetracker db is really a tree capture table and do not represent a unique tree..
 */
const HttpError = require('../utils/HttpError');
const LegacyPlanterRepository = require('../repositories/Legacy/PlanterRepository');
const LegacyTreeRepository = require('../repositories/Legacy/TreeRepository');
const LegacyTreeAttributeRepository = require('../repositories/Legacy/TreeAttributeRepository');

class LegacyTree {
  constructor(session) {
    this._session = session;
    this._legacyTreeRepository = new LegacyTreeRepository(this._session);
  }

  async legacyTree({
    id,
    image_url,
    lat,
    lon,
    device_identifier = null,
    wallet = null,
    user_photo_url = null,
    note = '',
    captured_at,
  }) {
    const legacyPlanterRepo = new LegacyPlanterRepository(this._session);
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
      time_created: captured_at,
      time_updated: captured_at,
    });
  }

  async createTreesInLegacyDB(tree, attributes) {
    const legacyAttributesRepository = new LegacyTreeAttributeRepository(
      this._session,
    );
    const existingTree = await this._legacyTreeRepository.getByFilter({
      uuid: tree.uuid,
    });

    if (existingTree.length > 0) return existingTree[0];
    const result = await this._legacyTreeRepository.create(tree);
    const tree_attributes = attributes.map((attribute) => ({
      tree_id: result.id,
      ...attribute,
    }));
    if (tree_attributes.length) {
      await legacyAttributesRepository.create(tree_attributes);
    }
    return result;
  }

  async rejectTreesInLegacyDB({ legacyTreeId, rejectionReason }) {
    const result = await this._legacyTreeRepository.update({
      id: legacyTreeId,
      rejection_reason: rejectionReason,
      active: false,
      approved: false,
    });

    return result;
  }
}

module.exports = LegacyTree;
