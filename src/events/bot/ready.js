const { default: chalk } = require("chalk");
const { Routes } = require("discord-api-types/v10");
const { REST } = require("@discordjs/rest");
const config = require("../../../config");

module.exports = {
    name: "ready",
    /**
     * @param {import("discord.js").Client} client
     */
    run: async (client) => {
        const rest = new REST({ version: "10" }).setToken(config.token);

        try {
            await rest.put(Routes.applicationCommands(client.user.id), {
                body: client.commands,
            });
        } catch (e) {
            console.error(e);
        };

        console.log(chalk.green("[START]"), chalk.white(`${client.user.username} adlı bot başarıyla giriş yaptı!`));

        client.user.setPresence({
            activities: [{
                name: config.bot_status,
                type: 0,
            }],
            status: "online"
        });
    }
};