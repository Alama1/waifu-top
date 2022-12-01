const StateHandler = require('./handlers/StateHandler');
const CommandHandler = require('./handlers/CommandHandler');
const TelegramBot = require('node-telegram-bot-api');
const { Telegraf } = require('telegraf');

class TelegramManager {
    constructor(app) {
        this.app = app
        this.stateHandler = new StateHandler(this)
        this.commandHandler = new CommandHandler(this)
        this.bot = new Telegraf(this.app.config.properties.telegram.botToken);
        this.bot.launch();

    }

    connect() {
        this.bot.on('text', (msg) => {
            this.commandHandler.onMessage(msg)
        });
    }
}

module.exports = TelegramManager
