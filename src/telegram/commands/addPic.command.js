class addPicCommand {
    constructor(telegram) {
        this.telegram = telegram
        this.name = 'addPic'
    }

    async onCommand(message) {
        if (!this.isValidArgs(message)) {
            return 'Ошибка аргументов команды, убедитесь что вы ввели команду по шаблону \'/addPic {Ключевое имя}\''
        }
        const [rows, cols] = await this.telegram.app.mysql.getWaifu(message.trim())
        if (!rows[0].picture_key) return 'У этого кочевого имени уже есть фоточка, чтобы обновить ее используйте /updatePic'



    }

    isValidArgs(message) {
        return message.trim().split(' ').length === 1
    }

}

module.exports = addPicCommand
