const fs = require('fs')
require('dotenv').config()


class Configuration {
    properties = {
        telegram: {
            botToken: null,
            channelId: null,
            voteDuration: null,
        },
        database: {
            host: null,
            user: null,
            password: null,
            database: null,
        }
    }
    constructor() {
        if (fs.existsSync('config.json')) {
            this.properties = require('../config.json')
            this.properties.telegram.botToken = process.env.BOT_TOKEN
            this.properties.database.password = process.env.DB_PASS
        }
    }
}

module.exports = Configuration
