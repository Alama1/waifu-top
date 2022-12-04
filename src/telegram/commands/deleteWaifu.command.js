class deleteWaifuCommand {
    constructor(telegram) {
        this.telegram = telegram
        this.name = 'deleteWaifu'
    }

    async onCommand(message) {
        if (!this.isValidArgs(message)) {
            return 'Ошибка аргументов команды, убедитесь что вы ввели команду по шаблону \'/deleteWaifu {Ключевое имя}\''
        }
        const [rows, cols] = await this.telegram.app.mysql.deleteWaifu(message.trim())
        return rows
    }

    isValidArgs(message) {
        return message.trim().split(' ').length === 1
    }
}

module.exports = deleteWaifuCommand
