/* Replace with your SQL commands */
CREATE TABLE captures
(
    id uuid NOT NULL PRIMARY KEY,
    reference_id int8 NOT NULL,
    image_url varchar NOT NULL,
    lat numeric NOT NULL,
    lon numeric NOT NULL,
    gps_accuracy smallint NULL,
    planter_id int8 NOT NULL,
    planter_photo_url varchar NULL,
    planter_identifier varchar NOT NULL,
    device_identifier varchar NULL,
    note varchar NULL,
    status varchar NOT NULL,
    rejected_reason varchar NULL,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL
);

CREATE INDEX captures_status_idx ON captures (status);
CREATE INDEX captures_planter_idx ON captures (planter_id);
