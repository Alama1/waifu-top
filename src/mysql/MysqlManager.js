const mysql = require('mysql2/promise')
const bluebird = require('bluebird');
const {code} = require("telegraf/format");

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

    async getWaifu(name) {
        return await (await this.connection).execute('SELECT * FROM `waifu_top` WHERE `code_name` = ?', [name])
    }

    async getEverythingFromMainTable() {
        return await (await this.connection).execute('SELECT * FROM `waifu_top`').catch(e => console.log(e.message))
    }

    async getAllTopNumbers() {
        return await (await this.connection).execute('SELECT `top` FROM `waifu_top`').catch(e => console.log(e.message))
    }

    async deleteWaifu(name) {
        return await (await this.connection).execute('DELETE FROM `waifu_top` WHERE `code_name` = ?', [name]).catch(e => console.log(e.message))
    }

    async updateWaifuPic(newLink, name) {
        return await (await this.connection).execute('UPDATE `waifu_top` SET `picture_key` = ? WHERE `code_name` = ?', [newLink, name]).catch(e => console.log(e.message))
    }

    async getWaifuRealName(name) {
        return await (await this.connection).execute('SELECT `name` FROM `waifu_top` WHERE code_name=?', [name]).catch(e => console.log(e.message))
    }
    async getWaifusForVote(list) {
        return await (await this.connection).execute('SELECT * FROM `waifu_top` WHERE `code_name` IN (?, ?, ?, ?, ?, ?, ?, ?, ?)', list).catch(e => console.log(e.message))
    }

    async insertWaifu({name, code_name, top}) {
        return await (await this.connection).execute('INSERT INTO `waifu_top` (code_name, name, top) VALUES (?, ?, ?)', [code_name, name, top])
            .catch(e => {
                console.error(e)
            })
    }
}

module.exports = MysqlManager
