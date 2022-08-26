const { SlashCommandBuilder } = require('@discordjs/builders');
const { errorEmbed, succesEmbed } = require('../utils.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clear messages')
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Amount of messages to delete')
                .setRequired(true))
        .setDefaultMemberPermissions(8),
	async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        if (amount > 101) return interaction.reply(errorEmbed('Maximum amount of messages to delete is 100'))
        if (amount < 1) return interaction.reply(errorEmbed('Minimum amount of messages to delete is 1'))
        try {
            await interaction.channel.bulkDelete(amount)
        }
        catch (error) {
            if (error.code === 50034) {
                return interaction.reply(errorEmbed('Can\'t delete messages older than 2 weeks'))
            } else {
                return interaction.reply(errorEmbed('Something went wrong: ' + error))
            }
        }
        const word = amount == 1 ? 'message' : 'messages'
        const word2 = amount == 1 ? 'was' : 'were'
        await interaction.reply(succesEmbed(`${amount} ${word} ${word2} successfully deleted`))
	},
};