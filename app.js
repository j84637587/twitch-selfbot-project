const tmi = require("tmi.js");
const config = require("config");

const channels = config.get("CHANNELS");
const spam_channels = config.get("SPAM_CHANNELS");
const channel_ids = Object.keys(channels);
const RegExps = {};

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
  channels: channel_ids,
});

client.on("connected", (adress, port) => {
  console.log("\u001b[32mself-bot 啟動!\u001b[0m");

  // init
  for (const ch in channels) {
    if (!channels[ch].hasOwnProperty("extra")) continue;
    for (const e in channels[ch]["extra"]) {
      // make sure to create obj befor set property
      if (!RegExps.hasOwnProperty(ch)) {
        RegExps[ch] = {};
      }
      RegExps[ch][e] = new RegExp(
        channels[ch]["extra"][e]["regex"],
        channels[ch]["extra"][e]["regex_modifier"]
      );
    }
  }

  // spam interval
  let spamIntervalID = setInterval(sendEmoji, 3 * 61 * 1_000);
});

/**
 * Send emote to certain channel
 */
function sendEmoji() {
  console.log("\u001b[32mSend Emote\u001b[0m");
  // client.say("#aaaaalice425", "aaaaal1Heart ");
}

client.on("message", async (channel, tags, message, self) => {
  for (const ch in channels) {
    if (channel.substring(1) == ch) {
      for (const e in RegExps[ch]) {
        // regex match
        let match = RegExps[ch][e].exec(message);
        if (match == null) continue;

        // get username
        let index = match.length;
        while (index-- && !match[index]);
        if (index == -1) break;

        // make response
        let response = channels[ch]["extra"][e]["response"];
        response = response.replace("%username%", match[index]);
        response = response.replace("%emote_here%", channels[ch]["emoji"]);
        if (channels[ch]["response"] == true) {
          client.say(channel, response);
          console.log(`\u001b[32m${ch}: ${response}\u001b[0m`);
        } else {
          console.log(`\u001b[31m${ch}: ${response}\u001b[0m`);
        }
      }
      break;
    }
  }
});

client.on("cheer", (channel, userstate, message) => {
  let bits_count = ~~userstate["bits"];
  console.log(`cheer with ${senderCount} bits.`);
  let response = `@${userstate["display-name"]} 感謝小奇點 %emote_here% `;
  if (bits_count >= 500) {
    response += "777";
  }
  sayFormatResponse(channel, response);
});

/**
 * Raided
 * Channel is now being raided by another broadcaster.
 *
 * channel {string} Channel name being raided
 * username {string} - Username raiding the channel
 * viewers {integer} - Viewers count
 */
client.on("raided", (channel, username, viewers) => {
  let response = `@${username} 感謝揪團 %emote_here% 各位可以點擊主播的頭像兩下或是F5降落喔~ 觀眾也可以去追隨 @${username} 喔!`;
  sayFormatResponse(channel, response);
});

/**
 * Username gifted a subscription to recipient in a channel.
 *
 * channel {string} Channel name
 * username {string} Sender username
 * recipient {string} Recipient username
 */
client.on(
  "subgift",
  (channel, username, streakMonths, recipient, methods, userstate) => {
    console.log(`subgift by ${username} with ${senderCount} gifts.`);
    console.log(`${recipient}`);
    console.log(`${userstate}`);
    let response = `@${username} 感謝贈送訂閱 %emote_here% `;
    sayFormatResponse(channel, response);
  }
);

client.on("subscription", (channel, username, method, message, userstate) => {
  let response = `@${username} 感謝訂閱 %emote_here% `;
  sayFormatResponse(channel, response);
});

client.on("resub", (channel, username, method, message, userstate) => {
  let response = `@${username} 感謝訂閱 %emote_here% `;
  sayFormatResponse(channel, response);
});

function sayFormatResponse(channel, response) {
  for (const ch in channels) {
    // console.log(ch, channels[ch], channel.substring(1))
    if (channel.substring(1) == ch) {
      response = response.replace("%emote_here%", channels[ch]["emoji"]);
      if (channels[ch]["response"] == true) {
        setTimeout(client.say, 5 * 1_000, channel, response);
        console.log(`\u001b[32m${ch}: ${response}\u001b[0m`);
      } else {
        console.log(`\u001b[31m${ch}: ${response}\u001b[0m`);
      }
      break;
    }
  }
}

client.connect();
