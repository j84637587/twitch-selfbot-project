const express = require("express");
const mongoose = require('mongoose');
const methodOverride = require('method-override')
require('dotenv').config();
require('./twitch_selfbot/twitch_selfbot');
const Channel = require('./models/channel');

const app = express();
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static('dist'));
app.use(express.json());
app.use(methodOverride('_method'));

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
//         commands: [
//             {
//                 command: "!songqueue",
//                 response: "@%username% 歌單列表: https://streamelements.com/hana_yuuka/mediarequest"
//             },
//             {
//                 command: "!songlist",
//                 response: "@%username% 歌單列表: https://streamelements.com/hana_yuuka/mediarequest"
//             },
//             {
//                 command: "!srrule",
//                 response: "@%username% YT 直播時，節目類型、綜藝、音樂劇、米津玄師、惱人音樂、版權抓很兇的音樂...等請勿點歌，有點會直接跳過，精華類可以點。優花有最終決定權。"
//             }
//         ],
//         regexs: [
//             {
//                 regex: "^.*\\s\\((.*)\\)\\s感謝您的追隨~$",
//                 regex_modifier: "m",
//                 response: "@%username% 感謝追隨 %emote_here%"
//             },
//             {
//                 regex: "^(.*)\\s感謝您的追隨~$",
//                 regex_modifier: "m",
//                 response: "@%username% 感謝追隨 %emote_here%"
//             }
//         ],
//         spam: {
//             enable: false,
//             cycle: 183000,
//             message: "aaaaal1Hug"
//         }
//     }
// ).save();

Channel.find().count(function (err, count) {
    if (err) console.log(err)
    else console.log("Count is", count)
})

app.listen(process.env.PORT, () => console.log(`*** Server Running on http://localhost:${process.env.PORT}`));