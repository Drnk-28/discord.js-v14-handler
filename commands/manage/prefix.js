const { EmbedBuilder, PermissionsBitField } = require("discord.js")

module.exports = {
  name: "prefix",
  aliases: [],
  description: "Apart from seeing the prefix on this server, you can also change it",
  usage: "{prefix}{cname} [new prefix]",
  cooldown: 10,
  developer: false,
  permission: PermissionsBitField.Flags.SendMessages,
  
  run: async(client, message, args) => {
    // cek prefix
    if(!args[0]) {
      let data = await client.getGuildData(message.guild.id)
      
      let embed = new EmbedBuilder()
      .setAuthor({
        name: `My prefix is ​​in ${message.guild.name}`,
        iconURL: message.guild.iconURL({dynamic: true, size: 512})
      })
      .setColor("#FFB080")
      .setDescription(`> my default prefix is: **${client.config.prefix}**\n> my prefix on this server is: **${data.prefix}**`)
      .setTimestamp()
      
      message.reply({embeds: [embed]})
      
    } else {
      let data = await client.createGuildData(message.guild.id)
      // Cek permissions from the user
      let authPerms = message.channel.permissionsFor(message.author)
      if(!authPerms.has(PermissionsBitField.Flags.ManageGuilds)) {
        return message.reply({embeds: [client.errEmbed("Hi, you don't have access to change the prefix on this server")]})
      }
      // main 
      if(args[0].length > 5) {
        let msg = client.errEmbed("sorry, like your new prefix number is too long")
        return message.reply({embeds: [msg]})
      } else {
        data.prefix = args[0]
        await data.save()
        
        let embed = new EmbedBuilder()
        .setAuthor({
          name: `new prefix for ${message.guild.name}`,
          iconURL: message.guild.iconURL({dynamic: true, size: 512})
          
        })
        .setColor("#00FF72")
        .setDescription(`> my default prefix is: **${client.config.prefix}**\n> my new prefix on this server is: **${args[0]}**\n> ${client.emoji.check} congratulations, you have successfully changed my prefix on this server `)
        .setTimestamp()
        
        message.reply({embeds: [embed]})
      }
      
    }
  }
}

/*
 thanks to me FuadJTM
 https://github.com/FuadJTM/discord.js-v14-handler
*/
