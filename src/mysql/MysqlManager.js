const mysql = require('mysql2/promise')
const bluebird = require('bluebird');

class MysqlManager {
    constructor(app) {
        this.app = app
        this.connection = mysql.createConnection({
            host: this.app.config.properties.database.host,
            user: this.app.config.properties.database.user,
            password: this.app.config.properties.database.password,
            database: this.app.config.properties.database.database,
            Promise: bluebird
        })
    }

    async connect() {
    }

    async execute(sql) {
        await (await this.connection).execute(sql).catch(e => console.log(e.message))
    }

    async getEverythingFromMainTable() {
        return await (await this.connection).execute('SELECT * FROM `waifu_top`').catch(e => console.log(e.message))
    }

    async insertWaifu({name, code_name}) {
        return await (await this.connection).execute('INSERT INTO `waifu_top` (code_name, name, top, total_entries) VALUES (?, ?, ?, ?)', [code_name, name, 0, 0])
            .catch(e => {
                return e.message
            })
    }
}

module.exports = MysqlManager
