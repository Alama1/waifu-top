class newWaifuCommand {
    constructor(telegram) {
        this.telegram = telegram
        this.name = 'newWaifu'
    }

    async onCommand(message) {
        if (!this.isValidArgs(message)) {
            return 'Ошибка аргументов команды, убедитесь что вы ввели команду по шаблону \'/newWaifu {Полное имя}, {Ключевое имя}\''
        }
        const args = message.split(',')
        const res = this.telegram.app.mysql.insertWaifu({name: args[0], code_name: args[1].trim()})
        return 'Success!'
    }

    isValidArgs(message) {
        const splinted = message.split(',')
        if (splinted.length !== 2) return false
        return splinted[1].trim().split(' ').length <= 1;
    }
}

module.exports = newWaifuCommand
