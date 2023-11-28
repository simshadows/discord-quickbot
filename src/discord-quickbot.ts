import {
    REST,
    Routes,
    Client,
    Events,
    GatewayIntentBits,
    SlashCommandBuilder,
} from "discord.js";

console.log("Attempting to read environment variable 'GUILD_ID'...");
const envGuildID: string | undefined = process.env["GUILD_ID"];

async function registerCommands(client: Client) {
    if (!envGuildID) throw new Error("Guild ID must exist.");

    const app = client.application;
    if (!app) throw new Error("app should not be falsy");

    const token = client.token;
    if (!token) throw new Error("token should not be falsy");

    const rest = new REST().setToken(token);
    const data = await rest.put(
        Routes.applicationGuildCommands(app.id, envGuildID),
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
    console.log("Starting bot...");
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });

    client.once(Events.ClientReady, async (c) => {
        console.log("Registering commands...");
        await registerCommands(c);
        console.log(`Ready! Logged in as ${c.user.tag}`);
    });

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName == "user") {
            await interaction.reply(`This command was run by ${interaction.user.username}`);
        }
    });

    console.log("Attempting to read environment variable 'DISCORD_TOKEN'...");
    const token: string | undefined = process.env["DISCORD_TOKEN"];
    client.login(token);
}

runBot();

