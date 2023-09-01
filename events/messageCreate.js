const { Events , Collection } = require("discord.js")

module.exports = {
  name: Events.MessageCreate,
  execute: async (message, client) => {
    let { guild, author } = message
    if(!guild || author.bot) return
    
    let guilddata = await client.getGuildData(guild.id)
    /*
    multi prefix, example ghelp, whelp, chelp 
    it can be used, or if you don't like it that way, you can block it
    and replace with if(!message.content.startsWith(prefix)) return
    that's a single prefix
    */
    
    let prefixes = [client.config.prefix, guilddata.prefix]
    let prefix = ""
    
    prefixes.forEach((p) => {
      if(message.content.toLowerCase().startsWith(p)) {
        prefix = p
      }
    })
    
    if(!prefix) return
    let args = message.content.slice(prefix.length).trim().split(/ +/g)
    let cmd = args.shift().toLowerCase()
    
    let command = client.commands.get(cmd.toLowerCase()) || client.commands.find((c) => c.aliases && c.aliases.includes(cmd))
    
    if(!command) return
    
    // Check if the command is specifically for developers 
    if(command.developer === true) {
      if(!client.config.developer.includes(author.id)) return message.reply({embeds: [client.errEmbed("hi, looks like you are not my developer, you can't use this command.")]})
    }
    
    // COMMAND PERMISSION
    if(command.permission) {
      let authpermiss = message.channel.permissionsFor(author)
      if(!authpermiss) {
        return message.reply({embeds: [client.errEmbed("Sorry, you don't have more access to use this command.")]})
      }
    }
    
    // COOLDOWN COMMANDS 
    const { cooldowns } = client
    if(!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection())
    }
    
    let now = Date.now()
    let timestamp = cooldowns.get(command.name)
    let cdAmount = (command.cooldown || 5) * 1000
    
    if(timestamp.has(author.id)) {
      const expiredTime = timestamp.get(author.id) + cdAmount
      if(now < expiredTime) {
        let timeleft = (expiredTime - now) / 1000
        let msg = client.errEmbed(`Please wait **\`${timeleft.toFixed(1)} more second(s)\`**,\nbefore using **\`${command.name}\`** command`)
        return message.reply({embeds: [msg]})
      }
    }
    if(!client.config.developer.includes(author.id)) {
      timestamp.set(author.id, now)
    }
    setTimeout(() => {
      timestamp.delete(author.id)
    }, cdAmount)
    
    try {
      command.run(client, message, args)
    } catch (err) {
      console.log(`ERROR : Events messageCreate: \n${err}`)
      return message.channel.send({embeds: [client.errEmbed(`I don't know what's going on, like you need to notify the developer if an error occurs: \`${err.message}\``)]})
    }
  }
}
/*
 thanks to me FuadJTM
 https://github.com/FuadJTM/discord.js-v14-handler
*/
