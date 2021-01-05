const Broker = require('rascal').BrokerAsPromised
const config = require('./config').config

const publishToTopic = (async (payload) => {
     console.log(JSON.stringify(payload));
     const broker = await Broker.create(config);
     broker.on('error', console.error);
     if (broker == undefined) {
         throw "Couldn't connect to message broker";
     }
     broker.publish('capture-created', payload, 'field-data.capture.creation', function(err, publication) {
         if (err) throw err;
         publication.on('error', console.error)
     });
})

module.exports = { publishToTopic };