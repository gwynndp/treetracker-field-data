const axios = require('axios').default;

const TREETRACKER_LEGACY_API_URL =
  process.env.TREETRACKER_LEGACY_API_URL ||
  'http://treetracker-admin-api.admin-api';

const organizationRoute = (id) => (id ? `organization/${id}/` : ``);

const rejectLegacyTree = async ({
  id,
  organizationId,
  rejectionReason,
  legacyAPIAuthorizationHeader,
}) => {
  await axios.patch(
    `${TREETRACKER_LEGACY_API_URL}/api/${organizationRoute(
      organizationId,
    )}trees/${id}`,
    { id, approved: false, active: false, rejectionReason },
    {
      headers: { authorization: legacyAPIAuthorizationHeader },
    },
  );
};

module.exports = {
  rejectLegacyTree,
};
