const { EmbedBuilder } = require("discord.js");
const db = require("../../db.js")

module.exports = {
    name: "steam-indirim-sıfırla",
    description: "Steam indirim gönderimi sistemini sıfırlar.",
    /**
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */
    run: async (client, interaction) => {

        if (!db.has(interaction.guildId)) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, iconURL: interaction.user.displayAvatarURL() })
                .setDescription("Sistem zaten kurulu durumda değil.")
                .setFooter({ text: "developed by @wondexz & @spestedev", iconURL: client.user.displayAvatarURL() })
                .setColor("Red")

            return interaction.reply({ embeds: [embed] })
        }

        const data = db.get(interaction.guildId)

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setAuthor({ name: `${interaction.user.globalName || interaction.user.username} (@${interaction.user.username})`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription("Sistem başarıyla sıfırlandı")
            .setFooter({ text: "developed by @wondexz & @spestedev", iconURL: client.user.displayAvatarURL() })

        db.delete(interaction.guildId)
        db.unpush("channels", data.channel)

        interaction.reply({ embeds: [embed] })
    }
}