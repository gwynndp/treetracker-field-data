# Field data service

A service that owns the raw tree tracking data uploaded from devices collected via treetracker app.

## Development Environment Quick Start

1. Open terminal and navigate to a folder to install this project:

```
git clone https://github.com/Greenstand/treetracker-field-data.git
```

Install all necessary dependencies:

```
cd treetracker-field-data
npm install
```

2. In the command line run the following to decrypt and create `.env` file that contains connection credentials to the database and message queues this project relies on.

```
npm run decrypt
```

The command will prompt for a password, please reach out in slack `engineering` or `microservices-working-group` channels for the credential.
On successfully running the command, the file env.secret is decrypted and creates a `.env` file.

3. Now run the app

```
node .
```

The above will start the app listening at port 3006.

## Developing with locally running Database - Advanced

If you don't want to rely on the Greenstand's dev database, you can install the database on your machine. The app relies on a app specific postgres db, and another legacy treetracker main db, along with RabbitMQ messaging platform. Thus, connection urls for these infrastructure are required for the application to work.

For the field database, you could choose to use a locally running database.To use a local db, install postgres and run `database/db_init.sql` found in the project folder.

Create a `.env` file under the project folder and assign the value for

```
DATABASE_URL="postgresql://username:pwd@db_host:port/field_db?false"
```

Add one more URL value for the treetracker main db which is needed for the transition period during which `trees` table in main db acts as a source of device data. Check domain migration docs under https://github.com/Greenstand/system-design-docs for details on this migration project.

```
DATABASE_URL_LEGACYDB="<ping development channel to get the url for treetracker main db"
```

The main db is not specific dedicated to field-data service and hence it is preferable to connect to existing dev environment instead of running it locally.

To install Postgres here are some resources to get started on local database set up and migration:

- https://postgresapp.com
- pgAdmin and DBeaver are great GUI options to use for navigating your local db
- https://www.postgresql.org/docs/9.1/app-pgdump.html

Database Migration to create tables needed by the app.

From within the project folder issue the following command.

```
db-migrate  up --migrations-dir=database/migrations
```

If you have not installed db-migrate globally, you can run:

```
node_modules/db-migrate/bin/db-migrate up --migrations-dir=database/migrations
```

See here to learn more about db-migrate: https://db-migrate.readthedocs.io/en/latest/

This project publishes messages and hence relies on RabbitMQ messaging service. In the `.env` file in addition to the database, set the value for the rabbitmq url. Reach out in `development` channel in slack for the url.

```
RABBIT_MQ_URL=<value for the RabbitMQ messaging platform>
```

For reference use the file .env.example that lists the necessary environment variables to run the application.

# Architecture of this project

This project use multiple layer structure to build the whole system. Similar with MVC structure:

![layers](/layers.png 'layers')

- **Protocol layer**

Wallet API offers RESTFul API interace based on HTTP protocol. We use Express to handle all HTTP requests.

The Express-routers work like the controller role in MVC, they receive the requests and parameters from client, and translate it and dispatch tasks to appropriate business objects. Then receive the result from them, translate to the 'view', the JSON response, to client.

- **Service layer**

Both service layer and model layer are where all the business logic is located. Comparing to the Model , `service` object don't have state (stateless).

Please put business logic code into service object when it is hard to put them into the `Model` object.

Because we didn't use Factory or dependency injection to create object, so service layer also can be used as Factory to create `model` object.

- **Model layer**

The business model, major business logic is here. They are real object, in the perspective of object oriented programming: they have states, they have the method to do stuff.

There are more discussion about this, check below selection.

- **Repository layer**

Repository is responsible for communicate with the real database, this isolation brings flexibility for us, for example, we can consider replace the implementation of the storage infrastructure in the future.

All the SQL statements should be here.

TODO: Add link to WIKI page detailing our architecture rules

# How to test

## Unit test

To run the unit tests:

```
npm run test-unit
```

## Integration test

All the integration tests are located under folder `__tests__`

To run the integration test:

Run tests:

```
npm run test-integration
```

## Database seeding test

In order to efficiently run our integration tests, we rely on automated database seeding/clearing functions to mock database entries. To test these functions, run:

```
npm run test-seedDB
```

## Suggestion about how to run tests when developing

There is a command in the `package.json`:

```
npm run test-watch
```

By running test with this command, the tests would re-run if any code change happened. And with the `bail` argument, tests would stop when it met the first error, it might bring some convenience when developing.

NOTE: There is another command: `test-watch-debug`, it is the same with `test-watch`, except it set log's level to `debug`.

## Postman

Can also use Postman to test the API in a more real environment. Import the API spec from [here](https://github.com/Greenstand/treetracker-wallet-api/blob/master/docs/api/spec/treetracker-token-api.yaml).

To run a local server with some seed data, run command:

```
npm run server-test
```

This command would run a API server locally, and seed some basic data into DB (the same with the data we used in the integration test).

# Contributing

Create your local git branch and rebase it from the shared master branch. Please make sure to rebuild your local database schemas using the migrations (as illustrated in the Database Setup section above) to capture any latest updates/changes.

When you are ready to submit a pull request from your local branch, please rebase your branch off of the shared master branch again to integrate any new updates in the codebase before submitting. Any developers joining the project should feel free to review any outstanding pull requests and assign themselves to any open tickets on the Issues list.
