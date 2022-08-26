const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { errorEmbed, succesEmbed, sendDM } = require('../utils.js');
const { getCode, setUsed, isCodeUsed } = require('../mongoose.js');
const { NIL: EmptyUUID, validate: validateUUID } = require('uuid');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reedem')
		.setDescription('Redeem code')
        .addStringOption(option =>
            option.setName('code')
                .setDescription(`Code to redeem in format ${EmptyUUID}`)
                .setRequired(true))
        .setDefaultMemberPermissions(8),
	async execute(interaction) {
        const code = interaction.options.getString('code');
        const codeData = await getCode(code);
        const codeUsed = await isCodeUsed(code);
        if(!validateUUID(code)) return interaction.reply(errorEmbed(`Don't look like a code.\n- You entered: ${code}\n- Correct format: ${EmptyUUID}`));
        if(!codeData) return interaction.reply(errorEmbed(`Code not found`));
        if(codeUsed) return interaction.reply(errorEmbed(`Code already used by ${codeData.usedBy}`));
        const succesCodeEmbed = new MessageEmbed()
            .setTitle('Code was successfully redeemed')
            .setDescription(`**Thank you so much for your purchase!
            Your code was successfully redeemed.
            The data of the code is:
            ${codeData.data}**`)
            .setColor('GREEN')
        try {
            await sendDM(interaction, succesCodeEmbed);
            await setUsed(code, interaction);
        } catch(error) {
            console.log(error);
            return interaction.reply(errorEmbed(`We couldn't send you a DM with the code.\nPlease check if you have your DMs opened and you have not blocked the bot.`));
        }
        await interaction.reply(succesEmbed('Code was successfully redeemed, check your DMs.'));
	},
};