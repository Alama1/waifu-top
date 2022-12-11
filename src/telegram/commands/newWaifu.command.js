class newWaifuCommand {
    constructor(telegram) {
        this.telegram = telegram
        this.name = 'newWaifu'
    }

    async onCommand(message) {
        if (!this.isValidArgs(message)) {
            return 'Ошибка аргументов команды, убедитесь что вы ввели команду по шаблону \'/newWaifu {Полное имя}, {Ключевое имя}\''
        }
        const [name, code_name] = message.split(',')
        const [tops, someSht] = await this.telegram.app.mysql.getAllTopNumbers()
        const currentTop = tops.map(waifu => {
            return waifu.top
        })
        const [rows, cols] = await this.telegram.app.mysql.insertWaifu({name: name.trim(), code_name: code_name.trim(), top: Math.max(...currentTop) + 1})
        return rows
    }

    isValidArgs(message) {
        const splinted = message.split(',')
        if (splinted.length !== 2) return false
        return splinted[1].trim().split(' ').length <= 1;
    }
}

module.exports = newWaifuCommand
