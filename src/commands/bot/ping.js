const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "ping",
    description: "Botun pingini ölçer.",
    type: 1,
    /**
     * 
     * @param {import('discord.js').Client} client 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, iconURL: interaction.user.displayAvatarURL() })
            .setColor("Blue")
            .setDescription(`${client.ws.ping}ms`)
            .setFooter({ text: "developed by @wondexz & @spestedev" });

        interaction.reply({ embeds: [embed] });
    }
};