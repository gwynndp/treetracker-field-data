ALTER TABLE raw_capture
    DROP COLUMN field_user_id,
    DROP COLUMN field_user_photo_url,
    DROP COLUMN field_username,
    DROP COLUMN device_identifier,
    ADD session_id uuid REFERENCES session(id),
    ADD abs_step_count int,
    ADD delta_step_count int,
    ADD rotation_matrix int[];
ALTER TABLE raw_capture RENAME COLUMN attributes TO extra_attributes;


