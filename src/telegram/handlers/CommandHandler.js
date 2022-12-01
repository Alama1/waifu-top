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

        const res = await command.onCommand(message)
        event.reply(res)
    }
}

module.exports = CommandHandler
