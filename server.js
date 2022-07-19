const express = require("express");
const mongoose = require('mongoose');
require('dotenv').config();
require('./twitch_selfbot/twitch_selfbot');
const Channel = require('./models/channel');

const app = express();
app.use(express.json());

// process.env.DATABASE_LINK
mongoose.connect(process.env.DATABASE_LINK)
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

// API Use Routes
// app.use("/api/v1/user", require('../routes/api/botuser'));
// app.use("/api/v1/command", require('../routes/api/botcommands'));

// Create an instance of model SomeModel
const cc = new Channel(
    {
    channel_id: "hana_yuuka",
    enable: true,
    emoji: "hanayu5Shebao",
    commands: [
        {
            command: "!songqueue",
            response: "@%username% 歌單列表: https://streamelements.com/hana_yuuka/mediarequest"
        },
        {
            command: "!songlist",
            response: "@%username% 歌單列表: https://streamelements.com/hana_yuuka/mediarequest"
        },
        {
            command: "!srrule",
            response: "@%username% YT 直播時，節目類型、綜藝、音樂劇、米津玄師、惱人音樂、版權抓很兇的音樂...等請勿點歌，有點會直接跳過，精華類可以點。優花有最終決定權。"
        }
    ],
    regexs: [
        {
            regex: "^.*\\s\\((.*)\\)\\s感謝您的追隨~$",
            regex_modifier: "m",
            response: "@%username% 感謝追隨 %emote_here%"
        },
        {
            regex: "^(.*)\\s感謝您的追隨~$",
            regex_modifier: "m",
            response: "@%username% 感謝追隨 %emote_here%"
        }
    ],
    spam: {
        enable: false,
        cycle: 183000,
        message: "aaaaal1Hug"
    }
}
).save();

Channel.find().count(function (err, count) {
    if (err) console.log(err)
    else console.log("Count is", count)
})

app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));