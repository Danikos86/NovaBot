const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require ('./options')

const token = '5478595156:AAH6_2yzaZI-CFODgI0wo2ZxwETvW0GdGRE'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен её угадать!`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра угадай цифру'},
    
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    /*     bot.sendMessage(chatId, `Ты написал мне ${text}`) */
    
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/8.webp')
            return bot.sendMessage(chatId, `Welcome to the Club Buddy`)
        }
        if (text === '/info') {
            let lastName = msg.from.last_name != undefined ? msg.from.last_name : ''
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${lastName}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Ебло я тебя не понимаю, напиши нормально еще раз!')
    })
 
    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
           return startGame(chatId)
        }
        if  (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю ты отгадал цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start();