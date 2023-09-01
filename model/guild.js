const { Schema, model } = require("discord.js")

const guild = new Schema({
  guildID : {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    default: ">"
  }
})

module.exports = model("guild_data", guild)
/*
 thanks to me FuadJTM
 https://github.com/FuadJTM/discord.js-v14-handler
*/
