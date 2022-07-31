const express = require("express");
const session = require('express-session')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
require('dotenv').config();
require('./twitch_selfbot/twitch_selfbot');
const Channel = require('./models/channel');

const app = express();
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static('dist'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret', // 對session id 相關的cookie 進行簽名
    resave: true,
    saveUninitialized: false, // 是否儲存未初始化的會話
    cookie: {
        maxAge: 1000 * 60 * 3, // 設定 session 的有效時間，單位毫秒
    },
}));

// process.env.DATABASE_LINK
mongoose.connect(process.env.DATABASE_LINK)
    .then(() => console.log("*** MongoDB Is Connected..."))
    .catch((err) => console.log(err));

// API Use Routes
app.use("/", require('./routes/channel'));

// Create an instance of model SomeModel
// const cc = new Channel(
//     {
//         channel_id: "hana_yuuka",
//         enable: true,
//         emoji: "hanayu5Shebao",
//         regexes: [
//             {
//                 enable: true,
//                 regex: "^!songqueue\s.*",
//                 response: "@%username% 歌單列表: https://streamelements.com/hana_yuuka/mediarequest"
//             },
//             {
//                 enable: true,
//                 regex: "^!songlist\s.*",
//                 response: "@%username% 歌單列表: https://streamelements.com/hana_yuuka/mediarequest"
//             },
//             {
//                 enable: true,
//                 regex: "^!srrule\s.*",
//                 response: "@%username% YT 直播時，節目類型、綜藝、音樂劇、米津玄師、惱人音樂、版權抓很兇的音樂...等請勿點歌，有點會直接跳過，精華類可以點。優花有最終決定權。"
//             },
//             {
//                 enable: true,
//                 regex: "^!烏迪爾\s.*",
//                 response: "@%username% https://www.twitch.tv/hoodier_0626"
//             },
//             {
//                 enable: true,
//                 regex: "^!糟老呼\s.*",
//                 response: "@%username% https://www.twitch.tv/hoodier_0626"
//             },
//             {
//                 enable: true,
//                 regex: "^!委託\s.*",
//                 response: "@%username% 優花的委託網站 https://clibo.tw/users/WIbqhz 委託過的都給5顆星 <3"
//             },
//             {
//                 enable: true,
//                 regex: "^.*\\s\\((.*)\\)\\s感謝您的追隨~$",
//                 response: "@%username% 感謝追隨 %emote_here%"
//             },
//             {
//                 enable: true,
//                 regex: "^(.*)\\s感謝您的追隨~$",
//                 response: "@%username% 感謝追隨 %emote_here%"
//             }
//         ],
//         spam: [
//             {
//                 enable: false,
//                 cycle: 183000,
//                 message: "test"
//             }
//         ]
//     }
// ).save();

Channel.find().count(function (err, count) {
    if (err) console.log(err)
    else console.log("Count is", count)
})

app.listen(process.env.PORT, () => console.log(`*** Server Running on http://localhost:${process.env.PORT}`));