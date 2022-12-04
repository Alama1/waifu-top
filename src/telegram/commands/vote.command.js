const {Markup} = require("telegraf");

class voteCommand {
    constructor(telegram) {
        this.telegram = telegram
        this.name = 'vote'
    }

    async onCommand(message, event) {
        if (!this.isValidArgs(message)) {
            return 'Ошибка аргументов команды, убедитесь что вы ввели команду по шаблону \'/vote и 8 ключевых имен через запятую\' \n ' +
                'Ключевые имена можно узнать через команду /getAll'
        }
        const args = message.split(',').map((waifu) => waifu.trim())

        const [rows, cols] = await this.telegram.app.mysql.getWaifusForVote(args)
        const waifu_names = rows.map((waifu, index) => {
            return `${index + 1}: ${waifu.name}\n`
        })
        if (waifu_names.length < 9) {
            return 'Одно или несколько ключевых имен введены неверно'
        }

        this.telegram.voteList = {
            [rows[0].code_name]: [],
            [rows[1].code_name]: [],
            [rows[2].code_name]: [],
            [rows[3].code_name]: [],
            [rows[4].code_name]: [],
            [rows[5].code_name]: [],
            [rows[6].code_name]: [],
            [rows[7].code_name]: [],
            [rows[8].code_name]: []
        }

        this.telegram.hasVoteStarted = true

        setTimeout(() => {
            this.telegram.hasVoteStarted = false
            this.calculateVotes(event)
        }, this.telegram.app.config.properties.telegram.voteDuration)

        event.reply(waifu_names.join(''), {
            reply_markup: {
                inline_keyboard: [
                    [ { text: rows[0].name, callback_data: rows[0].code_name }, { text: rows[1].name, callback_data: rows[1].code_name }, { text: rows[2].name, callback_data: rows[2].code_name } ],
                    [ { text: rows[3].name, callback_data: rows[3].code_name }, { text: rows[4].name, callback_data: rows[4].code_name }, { text: rows[5].name, callback_data: rows[5].code_name }],
                    [ { text: rows[6].name, callback_data: rows[6].code_name }, { text: rows[7].name, callback_data: rows[7].code_name } , { text: rows[8].name, callback_data: rows[8].code_name }  ]
                ]
            }
        })
    }

    isValidArgs(message) {
        const splinted = message.split(',')
        return splinted.length === 9
    }

    async calculateVotes(event) {
        const results = []
        for (const waifu of Object.keys(this.telegram.voteList)) {
            const [rows, cols] = await this.telegram.app.mysql.getWaifuRealName(waifu)
            results.push([rows[0].name, this.telegram.voteList[waifu].length])
        }

        console.log(results)
        results.sort(sortFunction)

        console.log(results)

        function sortFunction(a, b) {
            if (a[1] === b[1]) {
                return 0;
            }
            else {
                return (a[1] < b[1]) ? 1 : -1;
            }
        }
        const finalRes = results.map(waifu => {
            return waifu.join(': ')
        })

        event.reply(`Голосование окончено! Вот результаты: \n ${finalRes.join('\n')}`)
    }

    async voteDone () {

    }
}

module.exports = voteCommand
