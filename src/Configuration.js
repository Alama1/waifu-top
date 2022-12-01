const fs = require('fs')
require('dotenv').config()


class Configuration {
    properties = {
        telegram: {
            botToken: process.env.BOT_TOKEN,
            channelId: '-1001526366156',
        },
        database: {
            host: '74.208.95.168',
            user: 'admin',
            password: process.env.DB_PASS,
            database: 'test',
        }
    }

    environmentOverrides = {
        SERVER_HOST: val => (this.properties.server.host = val),
    }

}

module.exports = Configuration
