module.exports = {
    config: {
        "vhosts": {
            "v1": {
                "connection": process.env.RABBIT_MQ_URL
            },
            "exchanges": [
                "treetracker_exchange"
            ],
        }
    }
}