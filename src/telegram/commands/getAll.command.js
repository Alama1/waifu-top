class getAllCommand {
    constructor(telegram) {
        this.telegram = telegram
        this.name = 'getAll'
    }

    async onCommand(message) {
        const [rows, cols] = await this.telegram.app.mysql.getEverythingFromMainTable()
        return rows.map((waifu) => {
            return `Waifu name: ${waifu.name} \n Code name: ${waifu.code_name} \n------------\n`
        })[0]
    }
}

module.exports = getAllCommand
