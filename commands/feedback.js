const { SlashCommandBuilder } = require('@discordjs/builders');
const { errorEmbed, succesEmbed } = require('../utils.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('feedback')
		.setDescription('Send a feedback')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Message to send')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('status')
                .setDescription('Status of feedback')
                .setRequired(true)
                .addChoices(
                    { name: 'Positive', value: 'pos' },
                    { name: 'Negative', value: 'neg' }
                ))
        .setDefaultMemberPermissions(8),
	async execute(interaction) {
		const { feedbackChannelName } = require('../json/config.json');
        const status = interaction.options.getString('status');
        const channel = interaction.guild.channels.cache.find(channel => channel.name === feedbackChannelName);
        if (!channel) return interaction.reply(errorEmbed('Feedback channel not found, it\'s name shoud be \"' + feedbackChannelName+ '\"'));
        const message = interaction.options.getString('message');
        const feedbackEmbed = new MessageEmbed()
            .setTitle('Feedback')
            .setDescription(`**Feedback from ${interaction.user}
            ${message}**`)
            .setColor(status === 'pos' ? 'DARK_GREEN' : 'DARK_RED')
        await channel.send({ embeds: [feedbackEmbed] });
        await interaction.reply(succesEmbed('Feedback sent'));
	},
};