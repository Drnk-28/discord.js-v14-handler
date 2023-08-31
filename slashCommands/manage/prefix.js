const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js")

module.exports = {
  permission: PermissionsBitField.Flags.SendMessages,
  data: new SlashCommandBuilder()
    .setName("prefix")
    .setDescription("check my prefix on this server")
    .addSubcommand((options) => options.setName("setup").setDescription("Change my default prefix according to your wishes")
      .addStringOption((options) => options.setName("new-prefix").setDescription("type 1 to 5 words, then I will make it the newest prefix").setRequired(true)))
    .addSubcommand((options) => options.setName("check").setDescription("check my prefix on this server")),
  run: async (client, interaction) => {
    
    let { options } = interaction
    let sub = await options.getSubcommand()

    switch (sub) {
      case "setup":
        let string = await options.getString("new-prefix")
        if(string.length > 5) {
          let err = client.errEmbed("That's too long for a prefix, try making it shorter")
          return await interaction.reply({embeds: [err], ephemeral: true})
        }
        let Guilddata = await client.createGuildData(interaction.guild.id)
        const embed = new EmbedBuilder()
        .setAuthor({
          name: "Prefix has been updated",
          iconURL: interaction.guild.iconURL({dynamic: true, size: 512})
        })
        .setColor("#00FF72")
        .setDescription(`> my default prefix is: **${client.config.prefix}**\n> my new prefix on this server is: **${string}**\n> ${client.emoji.check} congratulations, you have successfully changed my prefix on this server`)
        .setFooter({text: "note: you can also use one of them"})
        .setTimestamp()
        
        Guilddata.prefix = string
        await Guilddata.save()
        await interaction.reply({embeds: [embed]})
        break;

      case "check":
        let getGuilddata = await client.getGuildData(interaction.guild.id)
        const cekEmbed = new EmbedBuilder()
        .setAuthor({
          name: `my prefix on the server ${interaction.guild.name}`,
          iconURL: message.guild.iconURL({dynamic: true, size: 512})
        })
        .setColor("#FFB080")
        .setDescription(`> my default prefix is: **${client.config.prefix}**\n> my prefix on this server is: **${getGuilddata.prefix}**`)
        .setTimestamp()
      
        await interaction.reply({embeds: [cekEmbed]})
        break;
    }

  }
}
/*
 thanks to me FuadJTM
 https://github.com/FuadJTM/discord.js-v14-handler
*/