ALTER TABLE raw_capture
    ADD field_user_id int8,
    ADD field_user_photo_url varchar,
    ADD field_username varchar,
    ADD device_identifier varchar,
    DROP COLUMN session_id,
    DROP COLUMN abs_step_count,
    DROP COLUMN delta_step_count,
    DROP COLUMN rotation_matrix;
ALTER TABLE raw_capture RENAME COLUMN extra_attributes TO attributes;


