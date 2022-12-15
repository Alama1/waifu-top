class deactivateVote {
    constructor(telegram) {
        this.telegram = telegram
        this.name = 'voteStop'
    }

    async onCommand(message, event) {
        const userId = event.update.message.from.id
        const [rows, sht] = await this.telegram.app.mysql.getIdFromMailing(userId)

        if (rows.length === 0) {
            event.reply('Вы не подписаны на рассылку!')
            return
        }
        const [res, trash] = await this.telegram.app.mysql.removeIdFromMailing(userId)
        if (res.affectedRows >= 1) {
            event.reply('Вы успешно отписались от рассылки!')
            return
        }
        event.reply('Упс, что-то пошло не так...')
    }
}

module.exports = deactivateVote
