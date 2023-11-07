CREATE TABLE track
(
    id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id uuid NOT NULL REFERENCES session(id),
    locations_url varchar NOT NULL,
    bulk_pack_file_name varchar NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
