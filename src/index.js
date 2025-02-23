const { Client, Partials, IntentsBitField, EmbedBuilder } = require("discord.js");
const { default: chalk } = require("chalk");
const { readdirSync } = require("fs");
const config = require("../config");
const axios = require("axios");
const db = require("./db");

const client = new Client({
    intents: Object.values(IntentsBitField.Flags),
    partials: Object.values(Partials)
});

global.client = client;
client.commands = (global.commands = []);

readdirSync("./src/commands").forEach((category) => {
    readdirSync(`./src/commands/${category}`).forEach((file) => {
        if (!file.endsWith(".js")) return;

        const command = require(`./commands/${category}/${file}`);
        const { name, description, type, options, dm_permissions } = command;

        client.commands.push({
            name,
            description,
            type: type ? type : 1,
            options,
            dm_permissions
        });

        console.log(chalk.red("[COMMANDS]"), chalk.white(`The command named ${name} is loaded!`));
    });
});

readdirSync("./src/events").forEach((category) => {
    readdirSync(`./src/events/${category}`).forEach((file) => {
        if (!file.endsWith(".js")) return;

        const event = require(`./events/${category}/${file}`);
        const eventName = event.name || file.split(".")[0];

        client.on(eventName, (...args) => event.run(client, ...args));

        console.log(chalk.blue("[EVENTS]"), chalk.white(`Event named ${eventName} has been loaded!`));
    });
});

async function checkSteamDeals() {
    try {
        const res = await axios.get("https://store.steampowered.com/api/featuredcategories/?cc=US&l=english");
        const specials = res.data.specials.items;
        const channels = db.get("channels");
        
        if (!Array.isArray(channels) || channels.length === 0) {
            console.log("📭 Hiçbir kanal bulunamadı, mesaj gönderilmiyor.");
            return;
        }

        if (!specials || specials.length === 0) {
            console.log("🛑 Steam indirimleri bulunamadı.");
            return;
        }

        const embed = new EmbedBuilder()
            .setDescription(`### 🎮 Günün Steam İndirimleri`)
            .setColor("Green")
            .setTimestamp()
            .setFooter({ text: "developed by @wondexz & @spestedev" });

        specials.slice(0, 5).forEach((game) => {
            embed.addFields({
                name: `🔹 ${game.name}`,
                value: `~~${game.original_price / 100} $~~ → ${game.final_price / 100} $\n[Satın Al](https://store.steampowered.com/app/${game.id}/)`,
                inline: false,
            });
        });

        channels.forEach(async (channelId) => {
            try {
                const channel = await client.channels.fetch(channelId);
                if (channel) {
                    await channel.send({ embeds: [embed] });
                    console.log(`✅ Mesaj gönderildi: ${channelId}`);
                }
            } catch (err) {
                console.error(`❌ Kanal ${channelId} bulunamadı veya erişim hatası:`, err);
            }
        });

    } catch (error) {
        console.error("🚨 Steam indirimleri çekilirken hata oluştu:");
        console.log(error)
    }
}

checkSteamDeals();
setInterval(checkSteamDeals, config.sendDelay);

client.login(config.token);