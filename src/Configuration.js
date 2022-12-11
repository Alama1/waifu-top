const fs = require('fs')
require('dotenv').config()


class Configuration {
    properties = {
        telegram: {
            botToken: process.env.BOT_TOKEN,
            channelId: '-1001526366156',
            voteDuration: 60000,
        },
        database: {
            host: '74.208.95.168',
            user: 'admin',
            password: process.env.DB_PASS,
            database: 'test',
        }
    }
}

module.exports = Configuration
