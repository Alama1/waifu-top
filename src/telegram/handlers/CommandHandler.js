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
            return
        }

        const res = await command.onCommand(message, event)
        if (!res) {
            return
        }
        switch(true) {
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
