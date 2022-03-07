INSERT INTO field_data.wallet_registration
 (
   wallet,
   user_photo_url,
   grower_account_id,
   first_name,
   last_name,
   phone,
   email,
   lat,
   lon,
   registered_at,
   v1_legacy_organization
 )
SELECT COALESCE(planter_registrations.phone, planter_registrations.email),
  COALESCE(planter_photos.planter_photo_url, 'none'),
  treetracker.grower_account.id,
  planter_registrations.first_name,
  planter_registrations.last_name,
  planter_registrations.phone,
  planter_registrations.email,
  planter_registrations.lat,
  planter_registrations.lon,
  planter_registrations.created_at,
  planter_registrations.organization
FROM planter_registrations
JOIN (
  SELECT DISTINCT ON (planter_id)
    planter_id, planter_photo_url
  FROM trees
  ORDER BY planter_id, time_created DESC
) planter_photos
ON planter_photos.planter_id = planter_registrations.planter_id
JOIN treetracker.grower_account
ON treetracker.grower_account.wallet = COALESCE(planter_registrations.phone, planter_registrations.email)
WHERE COALESCE(planter_registrations.phone, planter_registrations.email) IS NOT NULL
AND planter_registrations.lat IS NOT NULL
AND planter_registrations.lon IS NOT NULL


