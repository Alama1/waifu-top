const fs = require("fs");

class CommandHandler {
    constructor(telegram) {
        this.telegram = telegram
        this.commands = new Map()
        let commandFiles = fs.readdirSync('./src/telegram/commands').filter(file => file.endsWith('.js'))
        for (const file of commandFiles) {
            const command = new (require(`../commands/${file}`))(telegram)
            this.commands.set(command.name, command)
        }
    }

    async onMessage(event) {
        let incomingMessage = event.update.message.text.split(' ')
        const commandName = incomingMessage.shift().replace('/', '')
        const message = incomingMessage.join(' ')

        let command = this.commands.get(commandName)
        if (!command) {
            console.log('No')
            return
        }

        const res = await command.onCommand(message, event)
        if (!res) {
            return
        }
        const pic = res.picture_key || 'AgACAgIAAxkBAAIBn2ONNirQiNBDvEtZow5WfR-Se76IAAI5xTEbB9ZoSP-Gqj2ddSxUAQADAgADbQADKwQ'
        switch(true) {
            case res.hasOwnProperty('picture_key'):
                event.replyWithPhoto(pic, { caption: `Name: ${res.name}\nCode name: ${res.code_name}\nTop: ${res.top}\n`})
                break
            case res.affectedRows === 1:
                event.reply('Готово!')
                break
            case res.includes('Duplicate entry'):
                event.reply('Вайфу с таким ключевым именем уже есть!')
                break
            case typeof res === "string":
                event.reply(res)
                break
            default:
                event.reply('Unexpected error')
        }
    }
}

module.exports = CommandHandler
