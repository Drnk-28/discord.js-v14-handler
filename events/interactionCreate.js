const { Events, InteractionType } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  execute: async (interaction) => {
    let client = interaction.client;
    if (interaction.type == InteractionType.ApplicationCommand) {
      if (interaction.user.bot) return;
      try {
        const command = client.slashcommands.get(interaction.commandName);
        if(command.permission) {
          let authPermiss = interaction.channel.permissionsFor(interaction.user)
          if(!authPermiss.has(command.permission)) return interaction.reply({content: "Sorry, you don't have access to use these slash commands", ephemeral: true})
        }
        command.run(client, interaction);
      } catch (e) {
        console.log(e);
        interaction.reply({ content: "I don't know why, but this error occurred", ephemeral: true });
      }
    }
  },
};
/*
 thanks to me FuadJTM
 https://github.com/FuadJTM/discord.js-v14-handler
*/
