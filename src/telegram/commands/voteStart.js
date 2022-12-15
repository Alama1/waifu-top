class voteStart {
    constructor(telegram) {
        this.telegram = telegram
        this.name = 'voteStart'
    }

    async onCommand(message, event) {
        const userId = event.update.message.from.id
        const [rows, sht] = await this.telegram.app.mysql.getIdFromMailing(userId)

        if (rows.length === 1) {
            event.reply('Вы уже подписаны на рассылку!')
            return
        }
        const [res, trash] = await this.telegram.app.mysql.addIdToMailing(userId)
        if (res.affectedRows >= 1) {
            event.reply('Вы успешно подписались на рассылку!')
            return
        }
        event.reply('Упс, что-то пошло не так...')
    }
}

module.exports = voteStart
