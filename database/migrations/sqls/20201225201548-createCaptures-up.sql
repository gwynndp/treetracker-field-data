/* Replace with your SQL commands */
CREATE TABLE capture
(
    id uuid NOT NULL PRIMARY KEY,
    reference_id int8 NOT NULL,
    image_url varchar NOT NULL,
    lat numeric NOT NULL,
    lon numeric NOT NULL,
    gps_accuracy smallint NULL,
    planter_id int8 NOT NULL,
    planter_photo_url varchar NULL,
    planter_contact varchar NOT NULL,
    device_identifier varchar NULL,
    note varchar NULL,
    attributes jsonb NULL, 
    status varchar NOT NULL,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL
);

CREATE INDEX capture_status_idx ON capture(status);
CREATE INDEX capture_planter_idx ON capture(planter_id);
CREATE INDEX capture_planter_ctct_idx ON capture(planter_contact);
CREATE INDEX capture_crdate_idx ON capture(created_at);
CREATE INDEX capture_update_idx ON capture(updated_at);
