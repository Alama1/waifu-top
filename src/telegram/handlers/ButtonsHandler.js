const fs = require("fs");
const {json} = require("stream/consumers");

class ButtonsHandler {
    constructor(telegram) {
        this.telegram = telegram
    }

    async onMessage(event) {
        switch (true) {
            case event.update.hasOwnProperty('callback_query'):
                this.waifuVote(event)
                break
            default:
                await event.answerCbQuery('О-оу, что-то пошло не так');
        }
    }

    async waifuVote(event) {
        const waifu_id = event.update.callback_query.data
        if (!this.telegram.hasVoteStarted) {
            await event.answerCbQuery('Голосование еще не началось!');
            return
        }
        const fromUser = event.update.callback_query.from.id
        if (this.telegram.voteList[waifu_id].includes(fromUser)) {
            this.telegram.voteList[waifu_id] = this.telegram.voteList[waifu_id].filter(function(value){
                return value !== fromUser;
            })
            await event.answerCbQuery('Ваш голос был убран!');
            return
        }
        this.telegram.voteList[waifu_id].push(fromUser)
        await event.answerCbQuery('Ваш голос засчитан!');
    }
}

module.exports = ButtonsHandler
