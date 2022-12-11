class getAllCommand {
    constructor(telegram) {
        this.telegram = telegram
        this.name = 'getAll'
    }

    async onCommand(message) {
        const [rows, cols] = await this.telegram.app.mysql.getEverythingFromMainTable()
        const sortedByTop = rows.sort((a, b) => (a.top < b.top) ? -1 : 1)
        return sortedByTop.map((waifu) => {
            return `Waifu name: ${waifu.name} \nCode name: ${waifu.code_name}\nTop: ${waifu.top}\nTotal votes: ${waifu.total_entries}\nHas picture: ${waifu.picture_key ? 'yes':'no'} \n------------\n`
        }).join('')
    }
}

module.exports = getAllCommand
