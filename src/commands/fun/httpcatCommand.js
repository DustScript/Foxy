const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'httpcats',
  aliases: ['httpcat', 'catservers'],
  cooldown: 5,
  guildOnly: false,
  clientPerms: ['ATTACH_FILES', 'READ_MESSAGE_HISTORY'],

  async run(client, message) {
    const codes = ['100', '200', '201', '202', '204', '206', '207', '208', '300', '301', '302', '400', '404', '401', '408', '450', '499', '500', '504', '599', '511'];
    function choose(choices) {
      const index = Math.floor(Math.random() * choices.length);
      return choices[index];
    }
    const embed = new MessageEmbed()
      .setColor(client.colors.default)
      .setImage(`https://http.cat/${choose(codes)}`);
    await message.foxyReply(embed);
  },
};
