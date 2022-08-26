const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Bot status'),
	async execute(interaction) {
		await interaction.reply({ content: '**Active**', ephemeral: true }).catch(error => {console.log(error)});
	},
};