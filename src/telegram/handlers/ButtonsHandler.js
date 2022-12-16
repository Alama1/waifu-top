const fs = require("fs");
const {Telegraf, Markup} = require("telegraf");

class ButtonsHandler {
    constructor(telegram) {
        this.telegram = telegram
    }

    async onMessage(event) {
        switch (true) {
            case event.update.hasOwnProperty('callback_query'):
                switch (true) {
                    case event.update.callback_query.data.endsWith('card'):
                        this.showWaifuCard(event)
                        break
                    case event.update.callback_query.data.endsWith('delete'):
                        this.deleteWaifuCard(event)
                        break
                    default:
                        this.processVote(event)
                        break
                }
                break
            default:
                await event.answerCbQuery('О-оу, что-то пошло не так');
        }

    }

    async showWaifuCard(event) {
        await event.answerCbQuery('');
        const waifu_id = event.update.callback_query.data.split('_')
        waifu_id.pop()
        const [rows, cols] = await this.telegram.app.mysql.getWaifu(waifu_id.join('_'))
        const waifu = rows[0]
        const pic = waifu.picture_key ? waifu.picture_key : 'AgACAgIAAxkBAAIBn2ONNirQiNBDvEtZow5WfR-Se76IAAI5xTEbB9ZoSP-Gqj2ddSxUAQADAgADbQADKwQ'
        const card = await event.sendPhoto(pic, {
                caption: waifu.name,
                parse_mode: 'MarkdownV2',
                reply_markup: {
                    inline_keyboard: [
                        [ { text: 'Голосовать/отменить голос', callback_data: rows[0].code_name + `_${rows[0].top}`} ],
                        [ { text: 'Убрать карточку', callback_data: rows[0].code_name + `_${rows[0].top}_delete`} ],
                    ]
                }
            }
        )

        setTimeout(() => {
            event.tg.deleteMessage(card.chat.id, card.message_id).catch(e => {})
        }, 6000)

    }

    async deleteWaifuCard(event) {
        const chatID = event.update.callback_query.message.chat.id
        const messageId = event.update.callback_query.message.message_id
        await event.tg.deleteMessage(chatID, messageId)
    }

    async processVote(event) {
        let alreadyVotedReply
        const waifu_id = event.update.callback_query.data
        if (!this.telegram.hasVoteStarted) {
            await event.answerCbQuery('Голосование еще не началось!');
            return
        }
        if (!this.telegram.voteList.hasOwnProperty(waifu_id)) {
            await event.answerCbQuery('Такой вайфу в голосовании нет')
            return
        }
        const fromUser = event.update.callback_query.from.id
        if (this.telegram.voteList[waifu_id].includes(fromUser)) {
            this.telegram.voteList[waifu_id] = this.telegram.voteList[waifu_id].filter(function(value){
                return value !== fromUser;
            })

            const userId = event.update.callback_query.message.chat.id
            const waifuRealName = event.update.callback_query.message.caption
            if (this.telegram.usersAndWaifuTheyVoted.hasOwnProperty(userId)) {
                this.telegram.usersAndWaifuTheyVoted[userId] = this.telegram.usersAndWaifuTheyVoted[userId].filter(function (value) {
                    return value !== waifuRealName
                })
                alreadyVotedReply = await event.reply(`Вы проголосовали за: ${this.telegram.usersAndWaifuTheyVoted[userId].join(', ')}`)
            }
            setTimeout(() => { event.tg.deleteMessage(alreadyVotedReply.chat.id, alreadyVotedReply.message_id)}, 5000)
            await event.answerCbQuery('Ваш голос был убран!');
            return
        }
        this.telegram.voteList[waifu_id].push(fromUser)
        const userId = event.update.callback_query.message.chat.id
        const waifuRealName = event.update.callback_query.message.caption
        if (!this.telegram.usersAndWaifuTheyVoted.hasOwnProperty(userId)) {
            this.telegram.usersAndWaifuTheyVoted[userId] = [ waifuRealName ]
            alreadyVotedReply = await event.reply(`Вы проголосовали за: ${this.telegram.usersAndWaifuTheyVoted[userId].join(' ')}`)
        } else {
            this.telegram.usersAndWaifuTheyVoted[userId].push(waifuRealName)
            alreadyVotedReply = await event.reply(`Вы проголосовали за: ${this.telegram.usersAndWaifuTheyVoted[userId].join(', ')}`)
        }
        setTimeout(() => { event.tg.deleteMessage(alreadyVotedReply.chat.id, alreadyVotedReply.message_id)}, 5000)

        await event.answerCbQuery('Ваш голос засчитан!');
    }
}

module.exports = ButtonsHandler
