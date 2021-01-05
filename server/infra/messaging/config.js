module.exports = {
    config: {
        "vhosts": {
            "test": {
                "connection": {
                    "url": process.env.RABBIT_MQ_URL
                },
                "exchanges": ["field-data"],
                "queues": ["field-data-events"],
                "publications": {
                    "capture-created": {
                        "exchange": "field-data"
                    }
                }
            }
        }
    }
}