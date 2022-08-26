const { SlashCommandBuilder } = require('@discordjs/builders');
const { errorEmbed, succesEmbed } = require('../utils.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to kick')
                .setRequired(true))
        .setDefaultMemberPermissions(8),
	async execute(interaction) {
        const user = interaction.options.getUser('user');
        try {
            const member = interaction.guild.members.cache.get(user.id)
            if (!member) return interaction.reply(errorEmbed('User not found'))
            await member.kick();
        }
        catch (error) {
            if (error.code === 50013) return interaction.reply(errorEmbed('I don\'t have permission to kick this user'))
            return interaction.reply(errorEmbed('Something went wrong: ' + error + '\nError code: ' + error.code))
        }
        await interaction.reply(succesEmbed(`${user} successfully kicked`))
	},
};