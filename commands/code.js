const { SlashCommandBuilder } = require('@discordjs/builders');
const { errorEmbed, succesEmbed } = require('../utils.js');
const { MessageEmbed } = require('discord.js');
const { addCode, getCode, deleteCode, getCodesAll, getCodesUnUsed, getCodesUsed, getCodesCategory} = require('../mongoose.js');
const { v4: uuidv4 } = require('uuid');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('code')
        .setDescription('Codes manipulations')
        .addSubcommand(subcommand =>
            subcommand.setName('info')
                .setDescription('Get info about code')
                .addStringOption(option =>
                    option.setName('code')
                        .setDescription('Code to get info about')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('create')
                .setDescription('Generate code for category')
                .addStringOption(option =>
                    option.setName('category')
                        .setDescription('Category of code')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('data')
                        .setDescription('Data of code')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('delete')
                .setDescription('Delete code')
                .addStringOption(option =>
                    option.setName('code')
                        .setDescription('Code to delete')
                        .setRequired(true)))
        .addSubcommandGroup(subcommandGroup =>
            subcommandGroup.setName('list')
                .setDescription('List codes')
                .addSubcommand(subcommand =>
                    subcommand.setName('all')
                        .setDescription('List all codes'))
                .addSubcommand(subcommand =>
                    subcommand.setName('used')
                        .setDescription('List used codes'))
                .addSubcommand(subcommand =>
                    subcommand.setName('unused')
                        .setDescription('List unused codes'))
                .addSubcommand(subcommand =>
                    subcommand.setName('category')
                        .setDescription('List codes in category')
                        .addStringOption(option =>
                            option.setName('category')
                                .setDescription('Category of codes')
                                .setRequired(true))))
        .setDefaultMemberPermissions(8),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
        if(!subcommand) return interaction.reply(errorEmbed('Subcommand not found'));
        switch(subcommand) {
            case 'info': {
                const code = interaction.options.getString('code');
                const codeData = await getCode(code);
                if(!codeData) return interaction.reply(errorEmbed('Code not found'));
                const codeEmbed = new MessageEmbed()
                    .setTitle('Code info')
                    .setDescription(`**Code: ${code}
                    - Category: ${codeData.category}
                    - Data: ${codeData.data}
                    - Used By: ${codeData.usedBy ? codeData.usedBy : 'Nobody'}**`)
                    .setTimestamp()
                    .setColor('GREEN')
                await interaction.reply({ embeds: [codeEmbed], ephemeral: true });
            }
            break;
            case 'create': {
                const category = interaction.options.getString('category');
                const data = interaction.options.getString('data');
                const code = uuidv4();
                try {
                    if(!code) return interaction.reply(errorEmbed('Failed to generate code: ' + error));
                    await addCode(code, category, data);
                } catch (error) {
                    return interaction.reply(errorEmbed('Failed saving code to database: ' + error));
                }
                const codeEmbed = new MessageEmbed()
                    .setTitle('Code')
                    .setDescription(`**Successfully generated
                    - Category: ${category}
                    - Data: ${data}
                    - Code: ${code}**`)
                    .setTimestamp()
                    .setColor('GREEN')
                await interaction.reply({ embeds: [codeEmbed], ephemeral: true });
            }
            break;
            case 'delete': {
                const code = interaction.options.getString('code');
                try {
                    await deleteCode(code);
                } catch (error) {
                    return interaction.reply(errorEmbed('Failed to delete code: ' + error));
                }
                const codeEmbed = new MessageEmbed()
                    .setTitle('Code')
                    .setDescription(`**Successfully deleted code: ${code}**`)
                    .setTimestamp()
                    .setColor('GREEN')
                await interaction.reply({ embeds: [codeEmbed], ephemeral: true });
            }
            break;
            default: {
                const codes = subcommand === 'all' ? await getCodesAll() : subcommand === 'used' ? await getCodesUsed() : subcommand === 'unused' ? await getCodesUnUsed() : await getCodesCategory(interaction.options.getString('category'));
                if(codes.length <= 0) return interaction.reply(errorEmbed('No codes found'));
                const embeds = [];
                let description = '';
                for(let i = 0; i < codes.length; i++) {
                    description += `**- Code: ${codes[i].code}\n- Category: ${codes[i].category}\n- Data: ${codes[i].data}\n- Used By: ${codes[i].usedBy}**\n\n`;
                    if(description.length > 500) {
                        embeds.push(new MessageEmbed()
                            .setTitle(`List of ${subcommand} codes`)
                            .setDescription(description)
                            .setTimestamp()
                            .setColor('DARK_GREEN'));
                        description = '';
                    }
                }
                if(description.length > 0) {
                    embeds.push(new MessageEmbed()
                        .setTitle(`List of ${subcommand} codes`)
                        .setDescription(description)
                        .setTimestamp()
                        .setColor('DARK_GREEN'));
                }
                await interaction.reply({ embeds: embeds, ephemeral: true });
            }
        }
	},
};