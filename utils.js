const { MessageEmbed } = require('discord.js');

function errorEmbed(error) {
    return {embeds: [ new MessageEmbed()
        .setTitle('Error')
        .setDescription(`**${error}**`)
        .setColor('RED')
        .setTimestamp()
    ], ephemeral: true} 
}

function succesEmbed(msg) {
    return {embeds: [ new MessageEmbed()
        .setTitle('Successfully')
        .setDescription(`**${msg}**`)
        .setColor('GREEN')
        .setTimestamp()
    ], ephemeral: true} 
}

async function sendDM(interaction, embed) {
    const user = await interaction.guild.members.cache.get(interaction.user.id);
    const dm = await user.createDM();
    await dm.send({embeds: [embed]});
    await user.deleteDM();
}

function getRandom(list) {
    var array = [];
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      var chance = item.chance / 10;
      for (var j = 0; j < chance; j++) {
        array.push(item.type);
      }
    }
    var idx = Math.floor(Math.random() * array.length);
    return array[idx];
}

module.exports = { errorEmbed, sendDM, getRandom, succesEmbed };