const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');



const BOT_API_URL = "https://api.telegram.org/bot";
const token = '6173859445:AAElALXmytOjRC63Kpa1TjH_wdr_bdHutJc';
const webAppUrl = 'https://silver-bunny-74e27b.netlify.app/';
var bodyParser = require('body-parser')
const bot = new TelegramBot(token, {polling: true});
const app = express();
const fetch = require("node-fetch");
app.use(bodyParser.urlencoded({ extended: false }))
 app.use(express.json());



app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const name = msg.chat.username;
    const text = msg.text;

    if(text === '/start') {
        // await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
        //     reply_markup: {
        //         keyboard: [
        //             [{text: 'Заполнить форму', web_app: {url: webAppUrl + 'form'}}]
        //         ]
        //     }
        // })


        await bot.sendMessage(chatId, `Hello ${name} welcome to our site\n A button will appear below, you can order now `, {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'order', web_app: {url: webAppUrl}}]
                ]
            }
        })
    }

    if(msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)
            console.log(data)
            await bot.sendMessage(chatId, 'Спасибо за обратную связь!')
            await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country);
            await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street);

            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
            }, 3000)
        } catch (e) {
            console.log(e);
        }
        // await bot.sendPhoto({
        //     chat_id : message.chat.id,
        //     caption: 'This is my test image',
        //     photo: 'https://api.ashewa.com/media/products-thumbnails/1664127713.webp'//replace your image url here
        // })
    }
});
// app.get('/getphoto', async (req, res) => {


//     try {
//         await bot.answerWebAppQuery(queryId, {
//             type: 'article',
//             id: queryId,
//             title: 'Успешная покупка',
//             input_message_content: {
//                 // message_text: ` what is going on ${user.photo_url[0]}Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`
//                 message_text: ` ${pic}`
//             }

//         })

//         return res.status(200).json({});
//     } catch (e) {
//         return res.status(500).json({})
//     }
// })

// app.post('/web-data', async (req, res) => {
//     const {queryId, products = [],  totalPrice} = req.body;

// console.log("api hit")
//     try {
//         await bot.answerWebAppQuery(queryId, {
//             type: 'article',
//             id: queryId,
//             title: 'your product',
//             input_message_content: {
//                 // message_text: ` what is going on ${user.photo_url[0]}Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`
//                 message_text: ` what is going on Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`
//             }

//         })

//         return res.status(200).json({});
//     } catch (e) {
//         return res.status(500).json({})
//     }
// })
app.post('/web-data', async (req, res) => {
    console.log("api hit");
    const {queryId, products, totalPrice} = req.body;
    console.log(queryId)
    console.log(products)
    {products.map(item => (
        makeBotRequest("answerWebAppQuery", {
            web_app_query_id: queryId,
            result: {
                type: 'photo',
                id: '42',
                photo_url: item.img,
                thumb_url: 'https://picsum.photos/600/300.jpg',
                caption:item.title,
                reply_markup: {

                    inline_keyboard: [[
                        {
                            text: `total cost ${totalPrice}`,
                            web_app: { url: webAppUrl },
                        },
                    ]],
                }
            }
        })

    ))}
    // try {

    //     await bot.answerWebAppQuery(queryId, {
    //         type: 'article',
    //         id: queryId,
    //         title: 'bot title',
    //         input_message_content: {
    //            // photo_url: 'https://example.com/preview.jpg',
    //             message_text: ` your order total price is ${totalPrice}, and the order items are ${products.map(item => item.title).join(', ')}`
    //         },

    //     })
    // } catch (error) {

    // }
//     try {

//         await bot.answerWebAppQuery(queryId, {
//             type: 'article',
//             id: queryId,
//             title: 'bot title',
//             input_message_content: {
//                 photo_url: 'https://example.com/preview.jpg',
//                 message_text: ` your order total price is ${totalPrice}, and the order items are ${products.map(item => item.title).join(', ')}`
//             },

//         })
      function makeBotRequest(method, params) {
            return new Promise((resolve, reject) => {
                const url = BOT_API_URL + token+ "/" + method;
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(params)
                }).then(response => {
                    if (response.status !== 200) {
                        reject(`${url.replace(token, "TOKEN")} with parameters ${JSON.stringify(params)} responded with code ${response.status}`);
                    }
                    return response.json();
                }).then(data => {
                    resolve(data);
                }).catch(err => {
                    reject(err);
                });
            });}

        return res.status(200).json({});
    } )








const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))
