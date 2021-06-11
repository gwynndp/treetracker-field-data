const Broker = require('rascal').BrokerAsPromised
const config = require('./config').config
const log = require("loglevel");

const publishMessage = (async (payload, resultHandler) => {
    try {
        const broker = await Broker.create(config);
        const publication = await broker.publish("raw-capture-created", payload, "field-data.capture.creation");
        publication
        .on("success", resultHandler)
        .on("error", (err, messageId)=> {
            console.error(`Error with id ${messageId} ${err.message}`);
            throw err;
        });
    } catch(err) {
        console.error(`Error publishing message ${err}`);
    }
});

const subscribe = (async (subscriptionName, eventHandler) => {
    try {
        const broker = await Broker.create(config);
        const subscription = await broker.subscribe(subscriptionName);
        subscription
        .on('message',(message, content, ackOrNack) => {
            eventHandler(content);
            ackOrNack();
        })
        .on('error', console.error);
    } catch(err) {
        console.error(`Error subscribing to the queue ${subscriptionName}, error: ${err}`);
    }
});

module.exports = { publishMessage, subscribe };