ALTER TABLE raw_capture ADD COLUMN bulk_pack_file_name varchar;
ALTER TABLE wallet_registration ADD COLUMN bulk_pack_file_name varchar;
ALTER TABLE device_configuration ADD COLUMN bulk_pack_file_name varchar;
ALTER TABLE session ADD COLUMN bulk_pack_file_name varchar;