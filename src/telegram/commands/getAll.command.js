class getAllCommand {
    constructor(telegram) {
        this.telegram = telegram
        this.name = 'getAll'
    }

    async onCommand(message) {
        const [rows, cols] = await this.telegram.app.mysql.getEverythingFromMainTable()
    }
}

module.exports = getAllCommand
