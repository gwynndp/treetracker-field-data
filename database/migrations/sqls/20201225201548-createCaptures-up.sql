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
    planter_contact varchar NOT NULL,
    device_identifier varchar NULL,
    note varchar NULL,
    attributes jsonb NULL, 
    status varchar NOT NULL,
    rejected_reason varchar NULL,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL
);

CREATE INDEX captures_status_idx ON captures (status);
CREATE INDEX captures_planter_idx ON captures (planter_id);
CREATE INDEX captures_planter_ctct_idx ON captures(planter_contact);
CREATE INDEX captures_crdate_idx ON captures(created_at);
CREATE INDEX captures_update_idx ON captures(updated_at);
