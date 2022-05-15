const { Client, Collection } = require('discord.js');
const { token, mongooseConnectionString } = require('./config.json');
const client = new Client({ intents: 32767 });

//require some handlers boi
["commands", "events"]
.filter(Boolean)
.forEach(handler => {
    require(`${process.cwd()}/handlers/${handler}.js`)(client);
});

//client variables huehue
client.commands = new Collection();
//and finnaly login
client.login(token);