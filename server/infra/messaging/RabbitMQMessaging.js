const Broker = require('rascal').BrokerAsPromised
const config = require('./config').config

const publishToTopic = (async (payload) => {
     const broker = await Broker.create(config);
     broker.publish('capture-created', payload, 'field-data.capture.creation', function(err, publication) {
         if (err) throw err;
         publication.on('error', (err, messageId)=> {
             console.error("Error with id ${messageId} ${err.message}");
             throw err;
         });
     });
})

module.exports = { publishToTopic };