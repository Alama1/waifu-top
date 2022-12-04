class getAllCommand {
    constructor(telegram) {
        this.telegram = telegram
        this.name = 'getAll'
    }

    async onCommand(message) {
        const [rows, cols] = await this.telegram.app.mysql.getEverythingFromMainTable()
        return rows.map((waifu) => {
            return `Waifu name: ${waifu.name} \n Code name: ${waifu.code_name}\n Top: ${waifu.top}\n Total votes: ${waifu.total_entries} \n------------\n`
        }).join('')
    }
}

module.exports = getAllCommand
