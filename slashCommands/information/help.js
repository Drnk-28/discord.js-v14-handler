const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js")
const { readdirSync } = require("fs")

module.exports = {
  permission: PermissionsBitField.Flags.SendMessages,
  data: new SlashCommandBuilder()
  .setName("help")
  .setDescription("see available bot commands"),
  run: async (client, interaction) => {
    let cat = []
    await readdirSync("./slashCommands").forEach(async(dir) => {
      const commands = await readdirSync(`./slashCommands/${dir}`)
      
      let cmds = commands.map(async(cmd) => {
        const file = await require(`../../slashCommands/${dir}/${cmd}`)
        let name = file.data.name
        return name
      })
      
      let object = new Object()
      
      object = {
        name: dir.toUpperCase(),
        value: cmds.join(" , ")
      }
      
      cat.push(object)
    })
    
    let embed = new EmbedBuilder()
    .setAuthor({
      name: `available slash commands`,
      iconURL: interaction.guild.iconURL({dynamic: true, size: 1024})
    })
    .setColor("#FFB080")
    .addFields(cat)
    .setFooter({text: "code from fuadjtm"})
    
    
    return await interaction.reply({embeds: [embed]})
    
  }
}
/*
 thanks to me FuadJTM
 https://github.com/FuadJTM/discord.js-v14-handler
*/