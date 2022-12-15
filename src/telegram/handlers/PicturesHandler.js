class PicturesHandler {
    constructor(telegram) {
        this.telegram = telegram
    }

    async onMessage(event) {
        const files = event.update.message.photo
        if (!event.update.message.hasOwnProperty('caption')) {
            event.reply('Укажите ключевое имя вайфу вместе с фото')
            return
        }
        const waifu_id = event.update.message.caption
        if (!await this.ifWaifuExists(waifu_id)) {
            event.reply('Вайфу с таким кодовым именем не существует!')
            return
        }
        const [rows, cols] = await this.telegram.app.mysql.updateWaifuPic(files[0].file_id, waifu_id)
        if (rows.affectedRows >= 1) {
            event.reply('Готово!')
        } else {
            event.reply('Что-то пошло не так')
        }
    }

    async ifWaifuExists(code_name) {
        const [cols, rows] = await this.telegram.app.mysql.getWaifu(code_name)
        return cols.length !== 0
    }
}

module.exports = PicturesHandler
