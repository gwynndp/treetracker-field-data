const { knexMainDB } = require('../server/infra/database/knex');

before(async () => {
  knexMainDB.schema.raw(
    `CREATE TABLE IF NOT EXISTS trees
      (
          id integer DEFAULT 10,
          time_created timestamp without time zone NOT NULL,
          time_updated timestamp without time zone NOT NULL,
          missing boolean DEFAULT false,
          priority boolean DEFAULT false,
          cause_of_death_id integer,
          planter_id integer,
          primary_location_id integer,
          settings_id integer,
          override_settings_id integer,
          dead integer NOT NULL DEFAULT 0,
          photo_id integer,
          image_url character varying COLLATE pg_catalog."default",
          certificate_id integer,
          estimated_geometric_location geometry(Point,4326),
          lat numeric,
          lon numeric,
          gps_accuracy integer,
          active boolean DEFAULT true,
          planter_photo_url character varying COLLATE pg_catalog."default",
          planter_identifier character varying COLLATE pg_catalog."default",
          device_id integer,
          sequence integer,
          note character varying COLLATE pg_catalog."default",
          verified boolean NOT NULL DEFAULT false,
          uuid character varying COLLATE pg_catalog."default",
          approved boolean NOT NULL DEFAULT false,
          status character varying COLLATE pg_catalog."default" NOT NULL DEFAULT 'planted'::character varying,
          cluster_regions_assigned boolean NOT NULL DEFAULT false,
          species_id integer,
          planting_organization_id integer,
          payment_id integer,
          contract_id integer,
          token_issued boolean NOT NULL DEFAULT false,
          species character varying COLLATE pg_catalog."default",
          matching_hash character varying COLLATE pg_catalog."default",
          device_identifier character varying COLLATE pg_catalog."default",
          images jsonb,
          domain_specific_data jsonb,
          token_id uuid,
          name character varying COLLATE pg_catalog."default",
          CONSTRAINT tree_id_key PRIMARY KEY (id)
      );

      CREATE TABLE IF NOT EXISTS tree_attributes
      (
          id integer NOT NULL DEFAULT 20,
          tree_id integer,
          key character varying COLLATE pg_catalog."default",
          value character varying COLLATE pg_catalog."default"
      );`
    );
});
