/* Replace with your SQL commands */
CREATE TABLE events
(
    id uuid NOT NULL PRIMARY KEY,
    payload jsonb NOT NULL,
    status varchar NOT NULL,
    created_at timestamptz NOT NULL,
    updated_at timestamptz NOT NULL
);
CREATE INDEX event_status_idx ON events (status);
CREATE INDEX event_type_idx ON events USING GIN (payload jsonb_path_ops);
