class PicturesHandler {
    constructor(telegram) {
        this.telegram = telegram
    }

    async onMessage(event) {
        const files = event.update.message.photo

    }
}

module.exports = PicturesHandler
