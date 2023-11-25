import {
    REST,
    Routes,
    Client,
    Events,
    GatewayIntentBits,
    SlashCommandBuilder,
} from "discord.js";

console.log("Attempting to read environment variable 'DISCORD_TOKEN'...");
const token: string | undefined = process.env["DISCORD_TOKEN"];

// TODO: Can we just infer this?
console.log("Attempting to read environment variable 'CLIENT_ID'...");
const envClientID: string | undefined = process.env["CLIENT_ID"];

// TODO: Can we just infer this?
console.log("Attempting to read environment variable 'GUILD_ID'...");
const envGuildID: string | undefined = process.env["GUILD_ID"];

async function registerCommands() {
    if (!token) throw new Error("Token must exist.");
    if (!envClientID) throw new Error("Client ID must exist.");
    if (!envGuildID) throw new Error("Guild ID must exist.");

    const rest = new REST().setToken(token);
    const data = await rest.put(
        Routes.applicationGuildCommands(envClientID, envGuildID),
        {
            body: [
                new SlashCommandBuilder()
                    .setName("user")
                    .setDescription("Does stuff lmao")
            ],
        },
    );
    if (!((typeof data === "object") && (data) && ("length" in data))) throw new Error();
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
}

function runBot() {
    if (!token) throw new Error("Token must be defined.");

    console.log("Starting bot...");
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });

    client.once(Events.ClientReady, c => {
        console.log(`Ready! Logged in as ${c.user.tag}`);
    });

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName == "user") {
            await interaction.reply(`This command was run by ${interaction.user.username}`);
        }
    });

    console.log("Attempting to read environment variable 'DISCORD_TOKEN'...");
    client.login(token);
}

await registerCommands();
runBot();

