const fs = require("fs");
const {Telegraf, Markup} = require("telegraf");

class ButtonsHandler {
    constructor(telegram) {
        this.telegram = telegram
    }

    async onMessage(event) {
        switch (true) {
            case event.update.hasOwnProperty('callback_query'):
                if (!event.update.callback_query.data.endsWith('card')) {
                    this.waifuVote(event)
                    return
                }
                this.showWaifuCard(event)
                break
            default:
                await event.answerCbQuery('О-оу, что-то пошло не так');
        }
    }

    async showWaifuCard(event) {
        const [waifu_id, allOther] = event.update.callback_query.data.split('_')
        const [rows, cols] = await this.telegram.app.mysql.getWaifu(waifu_id)
            const waifu = rows[0]
        const pic = waifu.picture_key ? waifu.picture_key : 'AgACAgIAAxkBAAIBn2ONNirQiNBDvEtZow5WfR-Se76IAAI5xTEbB9ZoSP-Gqj2ddSxUAQADAgADbQADKwQ'
        const card = await event.sendPhoto(pic, {
                caption: waifu.name,
                parse_mode: 'MarkdownV2',
                reply_markup: {
                    inline_keyboard: [
                        [ { text: 'Голосовать/отменить голос', callback_data: rows[0].code_name} ],
                        ]
                }
            }
        )
        setTimeout(() => {
            event.tg.deleteMessage(card.chat.id, card.message_id)
        }, 30000)

        await event.answerCbQuery(waifu.name);
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
        console.log(event.update.callback_query.message.reply_markup.inline_keyboard[0])

        await event.answerCbQuery('Ваш голос засчитан!');
    }
}

module.exports = ButtonsHandler
