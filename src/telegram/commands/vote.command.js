class voteCommand {
    constructor(telegram) {
        this.telegram = telegram
        this.name = 'vote'
    }

    onCommand(message) {
        if (!this.isValidArgs(message)) {
            return 'Ошибка аргументов команды, убедитесь что вы ввели команду по шаблону \'/vote и 8 ключевых имен\' \n ' +
                'ключевые имена можно узнать через команду /getAll'
        }
        const args = message.split(',')

        const res = this.telegram.app.mysql.insertWaifu(args)
    }

    isValidArgs(message) {
        const splinted = message.split(',')
        if (splinted.any((waifu) => waifu.split(' ').length > 1)) return false
        return splinted.length === 8
    }
}

module.exports = voteCommand
