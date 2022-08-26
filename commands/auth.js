const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { succesEmbed, errorEmbed } = require('../utils.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('auth')
		.setDescription('Send auth message to the channel'),
	async execute(interaction) {
        const { authRoleName } = require('../json/config.json');
        const authRole = interaction.guild.roles.cache.find(role => role.name === authRoleName);
        if (!authRole) return interaction.reply(errorEmbed('Auth role not found, it\'s name shoud be \"' + authRoleName+ '\"'));
		const authEmbed = new MessageEmbed()
            .setTitle('Authentication')
            .setDescription('**Please, press the button below to prove that you are human**')
            .setColor('#2f3136')
        const authButton = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('auth')
                    .setLabel('Authenticate')
                    .setStyle(1)
            )
        const authMessage = await interaction.channel.send({ embeds: [authEmbed], components: [authButton] });
        await interaction.reply(succesEmbed('Auth message sent'));
        const filter = (interaction) => interaction.customId === 'auth';
        const authMessageCollector = authMessage.createMessageComponentCollector({ filter });
        authMessageCollector.on('collect', async (interaction) => {
            try {
                const authRole = interaction.guild.roles.cache.find(role => role.name === authRoleName);
                if (!authRole) return interaction.reply(errorEmbed('Auth role not found, it\'s name shoud be \"' + authRoleName+ '\"'));
                await interaction.member.roles.add(authRole);
            } catch (error) {
                return interaction.reply(errorEmbed('Something went wrong: ' + error + '\nError code: ' + error.code));
            }
            await interaction.reply(succesEmbed('You successfully authenticated'));
        }).on('end', async (collected) => {
            await authMessage.channel.send({ embeds: [authEmbed], components: [authButton] });
        })
	},
};