class getWaifuCommand {
    constructor(telegram) {
        this.telegram = telegram
        this.name = 'getWaifu'
    }

    async onCommand(message) {
        if (!this.isValidArgs(message)) {
            return 'Ошибка аргументов команды, убедитесь что вы ввели команду по шаблону \'/getWaifu {Ключевое имя}\''
        }

        const [rows, cols] = await this.telegram.app.mysql.getWaifu(message.trim())
        return rows[0] || 'Такой вайфу нет в базе денных'
    }

    isValidArgs(message) {
        return message.trim().split(' ').length === 1
    }
}

module.exports = getWaifuCommand
