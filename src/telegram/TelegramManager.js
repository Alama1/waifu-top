const StateHandler = require('./handlers/StateHandler');
const CommandHandler = require('./handlers/CommandHandler');
const ButtonHandler = require('./handlers/ButtonsHandler');
const PicturesHandler = require('./handlers/PicturesHandler');
const { Telegraf } = require('telegraf');

class TelegramManager {
    constructor(app) {
        this.app = app
        this.stateHandler = new StateHandler(this)
        this.commandHandler = new CommandHandler(this)
        this.buttonHandler = new ButtonHandler(this)
        this.pictureHandler = new PicturesHandler(this)
        this.bot = new Telegraf(this.app.config.properties.telegram.botToken);
        this.bot.launch();
        this.voteList = {}
        this.hasVoteStarted = false
    }

    connect() {
        this.bot.on('text', (msg) => {
            this.commandHandler.onMessage(msg)
        });

        this.bot.on('callback_query', async ctx => {
            this.buttonHandler.onMessage(ctx)
        })

        this.bot.on('message', ctx => {
            if (!ctx.update.message.hasOwnProperty('photo')) return
            this.pictureHandler.onMessage(ctx)
        });
    }
}

module.exports = TelegramManager
