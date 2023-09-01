const { EmbedBuilder } = require("discord.js")
const guildSchema = require("../model/guilddata")

module.exports = (client) => {
  
  client.emoji = {
    "wrong":"❎",
    "check":"✅"
  }
  
  client.errEmbed = (txt) => {
    let embed = new EmbedBuilder ()
    .setTitle("Looks like there's an error")
    .setColor("#FF4545")
    .setDescription(`${client.emoji.wrong} ${txt}`)
    .setTimestamp()
    return embed
  }
  
  /*
  @method let data = await client.getGuildData(guild.id)
  @param data.prefix
  @method let prefix = data.prefix
  */
  client.getGuildData = async(id) => {
    let data = await guildSchema.findOne({ guildID: id })
    if(!data) {
      let newdata = new guildSchema({ guildID: id })
      await newdata.save()
      return newdata
    }
    return data
  }
  
  
  /*
  @method let data = await client.createGuildData(guild.id)
  @param data.prefix = args
  @method await data.save()
  */
  client.createGuildData = async(id) => {
    let data = await guildSchema.findOne({ guildID: id })
    if(!data) {
      data = await data.create({ guildID: id })
    }
    return data
  }
  
}

/*
 thanks to me FuadJTM
 https://github.com/FuadJTM/discord.js-v14-handler
*/
