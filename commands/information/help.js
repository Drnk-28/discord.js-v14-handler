const { readdirSync } = require("fs")
const { PermissionsBitField, EmbedBuilder } = require("discord.js")

module.exports = {
  name: "help",
  aliases: ["cmd", "cmds", "commmand"],
  description: "see some of the commands available ",
  usage: "{prefix}{cname} [command]",
  cooldown: 10,
  developer: false,
  permission: PermissionsBitField.Flags.SendMessages,
  run: async (client, message, args) => {
    
    let botinvite = client.config.inviteURL || `https://discord.com/api/oauth2/authorize?client_id=862379123423182859&permissions=412317243456&scope=bot%20applications.commands`
    let addition = `if you don't understand it or maybe there are things you want to ask,\n- come to [our server](${client.config.support})\n- [invite me](${botinvite}) to your server`
    
      let data = await client.getGuildData(message.guild.id)
      
      // PREFIX
      let prefix = data.prefix
      let defaultprefix = client.config.prefix
      let allprefix
      if(prefix === defaultprefix) {
        allprefix = defaultprefix
      } else {
        allprefix = `${defaultprefix} | ${prefix}`
      }
      
    if(!args[0]) {
      
      // GET ALL COMMANDS
      let cat = []
      
      await readdirSync("./commands").forEach(async (dir) => {
        const commands = await readdirSync(`./commands/${dir}`)
        
        
        let cmds = commands.map(async (cmd) => {
          const file = await require(`../../commands/${dir}/${cmd}`)
          let name = file.name || ''
          
          return name
        })
        
        let object = new Object()
        
        object = {
          name: `${dir.toUpperCase()} -`,
          value: `\`${cmds.join(" , ")}\``
        }
        
        cat.push(object)
        
      })
      
      const allEmbed = new EmbedBuilder()
      .setAuthor({
        name: `${client.user.username} bot commands available`,
        iconURL: client.user.displayAvatarURL({dynamic: true, size: 1024})
      })
      .setDescription(`> all prefix: **${allprefix}**\nso below are my available commands....\n${addition}`)
      .addFields(cat)
      .setFooter({text: `type ${prefix}help [command] , to see the command in detail`})
      .setColor("#FFB080")
      message.channel.send({embeds: [allEmbed]})
    } else {
      
      // get bot commands
      let cmd = client.commands.get(args[0].toLowerCase()) || client.commands.find((y) => y.aliases && y.aliases.includes(args[0]))
      if(cmd) return message.reply({content: "I don't seem to have the command you mean"})
      
      // Check if it's not a developer using it 
      if(cmd.developer === true) {
        if(!client.config.developer.includes(message.author.id)) return message.reply({embeds: [client.errEmbed(`Sorry, this **${cmd.name}** command is a command specifically for our developers`)]})
      }
      
      let named = cmd.name 
      let aliases = cmd.aliases ? cmd.aliases.join(", ") : "there is no alias for this command"
      let description = cmd.description
      let usage = cmd.usage
      usage = usage.replace("{prefix}", prefix).replace("{cname}", name)
      let cooldown = cmd.cooldown + " second(s)"
      
      let notes = aaaa(`[] = optional\n<> = required`)
      
      const singleEmbed = new EmbedBuilder()
      .setAuthor({
        name: `detailed bot commands`,
        iconURL: client.user.displayAvatarURL({dynamic: true, size: 1024})
      })
      .setDescription(`below is detailed information of the command you mean\n${addition}\n`)
      .addFields([
        {
          name: `${prefix}${named}`,
          value: aaaa(`# Aliases:\n- ${aliases}\n\n# Cooldown:\n- ${cooldown}\n\n# Description:\n- ${description}\n\n# Usage:\n${usage}\n\u200b`) + note
        }
        ])
      .setFooter({text: "code from fuadjtm"})
      .setColor("#FFB080")
      .setTimestamp()
      
      message.channel.send({embeds: [singleEmbed]})
    }
  }
}

// hahaha this is just a variation
function aaaa(pp) {
  return `\`\`\`\n${pp}\`\`\``
}

/*
 thanks to me FuadJTM
 https://github.com/FuadJTM/discord.js-v14-handler
*/
