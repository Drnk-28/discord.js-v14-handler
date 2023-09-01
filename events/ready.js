const { Events } = require("discord.js")

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute: (client) => {
    console.log(`${client.user.username}, is ready to use now, I'm online....`)
    // STATUS: online , idle , dnd , invisible 
    client.user.setPresence({activities: "developed by fuadjtm", status: "online"})
    
  }
}
/*
 thanks to me FuadJTM
 https://github.com/FuadJTM/discord.js-v14-handler
*/
