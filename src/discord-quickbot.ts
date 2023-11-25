import { Client, Events, GatewayIntentBits } from "discord.js";

console.log("Starting bot...");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

console.log("Attempting to read environment variable 'DISCORD_TOKEN'...");
client.login(process.env["DISCORD_TOKEN"]);

