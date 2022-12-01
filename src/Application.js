const Configuration = require('./Configuration')
const TelegramManager = require('./telegram/TelegramManager')
const MysqlManager = require('./mysql/MysqlManager')

class Application {
    async register() {
        this.config = new Configuration()
        this.telegram = new TelegramManager(this)
        this.mysql = new MysqlManager(this)
    }

    async connect() {
        this.telegram.connect()
        this.mysql.connect()
    }
}

module.exports = new Application()
