/////////////////////////////////////////////////////////////////////////
//To my futur self, don't try to understand it, I didn't either
//npm install -g nodemon / nodemon index.js
//////////////////////////////////////////////////////////////////kiradtn
const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require("fs");
var prefix = "!";
bot.commands = new Discord.Collection();
bot.mutes = require("./mutes.json");

fs.readdir("Enderia/cmds/", (err, files) => { //chargement fs js
	if(err) console.error(err);

	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if(jsfiles.length <= 0) {
		console.log("No commands to load!");
		return;
	}
	console.log(`Loading ${jsfiles.length} commands in cmds/ !`);

	jsfiles.forEach((f, i) => { //pour chaque ft, i = *
		let props = require(`./cmds/${f}`); //f = function
		console.log(`${i + 1}: ${f} loaded!`);
		bot.commands.set(props.help.name, props);
	});
});

fs.readdir("Enderia/cmds/modo", (err, files) => { //chargement fs js
	if(err) console.error(err);

	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if(jsfiles.length <= 0) {
		console.log("No commands to load!");
		return;
	}
	console.log(`Loading ${jsfiles.length} commands in /modo/ !`);

	jsfiles.forEach((f, i) => { //pour chaque ft, i = *
		let props = require(`./cmds/modo/${f}`); //f = function
		console.log(`${i + 1}: ${f} loaded!`);
		bot.commands.set(props.help.name, props);
	});
});

fs.readdir("Enderia/cmds/utils", (err, files) => { //chargement fs js
	if(err) console.error(err);

	let jsfiles = files.filter(f => f.split(".").pop() === "js");
	if(jsfiles.length <= 0) {
		console.log("No commands to load!");
		return;
	}
	console.log(`Loading ${jsfiles.length} commands in /utils/ !`);

	jsfiles.forEach((f, i) => { //pour chaque ft, i = *
		let props = require(`./cmds/utils/${f}`); //f = function
		console.log(`${i + 1}: ${f} loaded!`);
		bot.commands.set(props.help.name, props);
	});
});

bot.on("ready", () => { //mute (json)
	bot.setInterval(() => {
		for(let i in bot.mutes) {
			let time = bot.mutes[i].time;
			let guildId = bot.mutes[i].guild;
			let guild = bot.guilds.get(guildId);
			let member = guild.members.get(i);
			let mutedRole = guild.roles.find(r => r.name === "Muted");
			if(!mutedRole) continue;

			if(Date.now() > time) {
				console.log(`${i} is now able to be unmuted!`);

				member.removeRole(mutedRole);
				delete bot.mutes[i];

				fs.writeFile("./mutes.json", JSON.stringify(bot.mutes), err => {
					if(err) throw err;
					console.log(`I have unmuted ${member.user.tag}.`);
				});
			}
		}
	}, 5000)
});

bot.on("message", async message => { //execution commande fs js
	let messageArray = message.content.split(/\s+/g);
	let command = messageArray[0];
	let args = messageArray.slice(1);
	if(message.author.bot) return;
	if(message.channel.type === "dm") return;
	if(!command.startsWith(prefix)) return;
	
	let cmd = bot.commands.get(command.slice(prefix.length));
	if(cmd) cmd.run(bot, message, args, prefix);
});

bot.on('warn', console.warn);

bot.on('error', console.error);

bot.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'));

bot.on('reconnecting', () => console.log('I am reconnecting now!'));

bot.on('ready', () => console.log(`${bot.user.tag} actif !`));

bot.login(TOKEN);
