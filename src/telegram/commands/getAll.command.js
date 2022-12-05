class getAllCommand {
    constructor(telegram) {
        this.telegram = telegram
        this.name = 'getAll'
    }

    async onCommand(message) {
        const [rows, cols] = await this.telegram.app.mysql.getEverythingFromMainTable()
        return rows.map((waifu) => {
            return `Waifu name: ${waifu.name} \nCode name: ${waifu.code_name}\nTop: ${waifu.top}\nTotal votes: ${waifu.total_entries} \n------------\n`
        }).join('')
    }
}

module.exports = getAllCommand
