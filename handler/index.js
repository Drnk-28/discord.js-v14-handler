const { Events, REST, Routes } = require("discord.js");
const { readdirSync } = require("fs")
const mongoose = require("mongoose")
const Database = require("my-json-database")
module.exports = async (client) => {
  try {
    let slashcommands = []
    let token = client.config.token || process.env.token
    let mongodb = client.config.mongodb || process.env.mongodb
    
    const rest = new REST({ version: "10" }).setToken(token)
    
    // LOAD PREFIX COMMANDS
    readdirSync("./commands").forEach(async (dir) => {
      const commands = readdirSync(`./commands/${dir}`).filter((f) => f.endsWith(".js"))
      
      for(const cmds of commands) {
        const command = await require(`../commands/${dir}/${cmds}`)
        client.commands.set(command.name, command)
      }
      
    })
    
    
    // LOAD SLASH COMMANDS
    readdirSync("./slashCommands").forEach(async (dir) => {
      const commands = readdirSync(`./slashCommands/${dir}`).filter((y) => y.endsWith(".js"))
    
      for(const cmds of commands) {
        const command = await require(`../slashCommands/${dir}/${cmds}`)
        slashcommands.push(command.data.name.toJSON())
        client.slashcommands.set(command.data.name, comman)
      }
    })
    
    // MONGODB CONNECTION || block this if you don't want to use any database or want to use another database
    mongoose.connect(mongodb, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => console.log("MONGOOSE : Connected.....")).catch((err) => console.log(`MONGOOSE : Disconnect\n${err}`))
    
    
    // RELOAD SLASH COMMANDS....
    client.on(Events.ClientReady, async () => {
      try {
        // so, if you don't like databases like mongodb, or SQL, or any other database, I recommend this database for you
        client.db = new Database("../my-database.json", {
          backups: {
            enabled: true,
            interval: 24 * 60 * 60 * 1000, // 24h
            folder: "./backups/"
          }
        })
        
        console.log(`started reload ${slashcommands.length} application commands..........`)
        /*
        
        below I use an application for multi servers, then if you want to change it to a single server, you can simply replace
        Routes.applicationCommands(....)
        
        become :
        Routes.applicationGuildCommands(client.user.id, client.config.testguild,{
        body: slashcommands
        })
        
        */
        let data = await rest.put(Routes.applicationCommands(client.user.id), {
          body: slashcommands
        })
        
        console.log(`Done, reload ${data.length} application commands`)
      }catch(err) {
        return console.log(`Error - Reload slash command\n${err}`)
      }
    })
    
    // EVENT HANDLER
    readdirSync("./events").forEach(async(file) => {
      const events = await require(`../events/${file}`)
      if(events.once) {
        client.once(events.name, (...args) => events.execute(...args, client))
      } else {
        client.on(events.name, (...args) => events.execute(...args, client))
      }
    })
    
    
  } catch (err) {
    return console.log(`Error - handler/index:\n${err}`)
  }
}
/*
 thanks to me FuadJTM
 https://github.com/FuadJTM/discord.js-v14-handler
*/
