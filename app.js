const tmi = require("tmi.js");
const config = require("config");

// regexes

const hana_yuuka_regex_follow = /^.*\s\((.*)\)\s感謝您的追隨~$/gm;
const hana_yuuka_regex_sub = /^已訂閱層級\s\d。這位使用者已經訂閱了\s\d+\s個月！$/gm;
const hana_yuuka_regex_raid = /^.*\s\((.*)\)\sjust\sraided\sthe\schannel\swith\s\d+\sviewers\sPogChamp$/m;

const alice_regex_follow = /^謝謝\s(.*\((.*)\)|.*)\s因為想愛愛所以追隨了！$/gm;
const alice_regex_sub = /^恭喜\s(.*\((.*)\)|.*)\s成為了\s\d+\s個月的愛愛教徒！$/gm;
const alice_regex_bits = /^謝謝\s(.*\((.*)\)|.*)\s贈送\s\d+\s小奇點！$/gm;

const ChatType = Object.freeze({
  GIFTS: 1,
  BITS: 2,
  FOLLOW: 3,
  SUB: 4,
  RAID: 5,
});

const client = new tmi.Client({
  options: {
    debug: false,
  },
  connection: {
    reconnect: true,
  },
  identity: {
    username: config.get("USERNAME"),
    password: config.get("PASSWORD"),
  },
  channels: config.get("CHANNELS"),
});

let spamIntervalID;

client.on("connected", (adress, port) => {
  //   client.action("self-bot 啟動!");
  console.log("\u001b[32mself-bot 啟動!\u001b[0m");
  spamIntervalID = setInterval(sendEmoji, 10 * 60 * 1_000);
});

/**
 * Send emote to certain channel
 */
function sendEmoji() {
  console.log("\u001b[32mSend Emote\u001b[0m");
  client.say("#aaaaalice425", "aaaaal1Heart ");
}

const regex = /^.*\s\((.*)\)\s感謝您的追隨\~$/gm;
client.on("message", async (channel, tags, message, self) => {
  console.log(`${tags["display-name"]}: ${message}`);
  if ((channel == "#hana_yuuka" || channel == "#quareta75") && tags.username == "streamelements") {
    // response(channel, message, hana_yuuka_regex_follow, '@%username% 感謝追隨 hanayu5Shebao');
    // response(channel, message, hana_yuuka_regex_sub, '@%username% 感謝訂閱 hanayu5Shebao');
    // response(channel, message, hana_yuuka_regex_raid, '@%username% 感謝揪團 hanayu5Shebao 各位可以點擊主播的頭像兩下或是F5降落喔~ 觀眾也可以去追隨@%username%喔!');
  } else if ((channel == "#aaaaalice425" || channel == "#quareta75") && tags.username == "streamelements"){
    response(channel, message, alice_regex_follow, '@%username% 感謝追隨 aaaaal1Hug');
    response(channel, message, alice_regex_sub, '@%username% 感謝訂閱 aaaaal1Hug');
    response(channel, message, alice_regex_bits, '@%username% 感謝小奇點 aaaaal1Hug');
  }
});

function response(channel, message, regex, resMsg) {
    let match;
    if ((match = regex.exec(message)) != null) {
        let username = match[match.length-1] == undefined ? match[match.length-2] : match[match.length-1];
        client.say(channel, resMsg.replace('%username%', username));
    }
}

/**
 *
 * @param {string} message
 */
function getMsgType(message) {
  const regex_gift =
    /^要贈送\s\d+\s份層級\s\d\s訂閱給\s.*\s的社群！這位朋友已經在這個頻道送禮共\s\d+\s次了！$/gm;
  const regex_bits =
    /^.*(((Cheer|BibleThump|cheerwhal|Corgo|uni|ShowLove|Party|SeemsGood|Pride|Kappa|FrankerZ|HeyGuys|DansGame|EleGiggle|TriHard1|Kreygasm|4Head|SwiftRage|NotLikeThis|FailFish|VoHiYo|PJSalt|MrDestructoid|bday|RIPCheer|Shamrock)\d+)\s)+.*$/gm;
  const regex_sub = /^已訂閱層級\s\d。這位使用者已經訂閱了\s\d+\s個月！$/gm;
  const regex_raid =
    /^.*\s\((.*)\)\sjust\sraided\sthe\schannel\swith\s\d+\sviewers\sPogChamp$/m;
  let match;
  if ((match = regex_gift.exec(message)) != null) {
    console.log("\u001b[32m 贈送訂閱 \u001b[0m");
    return [ChatType.GIFTS, ""];
  } else if ((match = regex_follow.exec(message)) != null) {
    console.log("\u001b[32m 追隨 \u001b[0m");
    return [ChatType.FOLLOW, match[1]];
  } else if ((match = regex_bits.exec(message)) != null) {
    console.log("\u001b[32m 小奇點 \u001b[0m");
    return [ChatType.BITS, ""];
  } else if ((match = regex_sub.exec(message)) != null) {
    console.log("\u001b[32m 訂閱 \u001b[0m");
    return [ChatType.SUB, ""];
  } else if ((match = regex_raid.exec(message)) != null) {
    console.log("\u001b[32m Raid \u001b[0m");
    return [ChatType.RAID, match[1]];
  }
  return undefined;
}

client.connect();
