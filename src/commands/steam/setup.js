const { EmbedBuilder } = require("discord.js");
const db = require("../../db");

module.exports = {
    name: "steam-indirim-kur",
    description: "Steam indirimlerini gönderen sistemi hazır hale getirir.",
    options: [
        {
            name: "channel",
            description: "Steam indirimlerini göndermek istediğiniz kanalı seçin.",
            type: 7,
            required: true
        }
    ],
    /**
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {
        const channel = interaction.options.getChannel("channel");

        if (db.has(interaction.guildId)) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, iconURL: interaction.user.displayAvatarURL() })
                .setDescription("Sistem zaten kurulu")
                .setFooter({ text: "developed by @wondexz & @spestedev", iconURL: client.user.displayAvatarURL() })

            return interaction.reply({ embeds: [embed] })
        }

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription("Sistem başarıyla kuruldu")
            .setFooter({ text: "developed by @wondexz & @spestedev", iconURL: client.user.displayAvatarURL() })

        db.set(interaction.guildId, { channel: channel.id })
        db.push("channels", channel.id)

        interaction.reply({ embeds: [embed] })
    }
}