const express = require('express')
const app = express()
const port = 5500

app.all('/', (req, res) => res.end("MG\'s EcoBotManager! | MGYT™ DEVELOPMENT!"))

app.listen(port, () =>
console.log(`Your app is listening a http://localhost:${port}`))

const Discord = require("discord.js");
const client = new Discord.Client({ disableMentions: 'everyone' });
client.on('disconnect', function(erMsg, code) {
  console.log('----- Bot disconnected from Discord with code: ', code, ' for reason: ', erMsg, ' -----');
  client.connect();
});
const Eco = require("quick.eco");
client.eco = new Eco.Manager(); // quick.eco
client.db = Eco.db; // quick.db
client.config = require("./botConfig");
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.shop = {
  laptop: {
    cost: 2000
  },
  mobile: {
    cost: 1000
  },
  pc: {
    cost: 3000
  }
};
const fs = require("fs");

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(f => {
        if (!f.endsWith(".js")) return;
        const event = require(`./events/${f}`);
        let eventName = f.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});

fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(f => {
        if (!f.endsWith(".js")) return;
        let command = require(`./commands/${f}`);
        client.commands.set(command.help.name, command);
        command.help.aliases.forEach(alias => {
            client.aliases.set(alias, command.help.name);
        });
    });
});


client.login(client.config.token || process.env.token);
