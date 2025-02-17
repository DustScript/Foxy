const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'eval',
  aliases: ['eval', 'evaljs', 'evaluate', 'evaluatejs'],
  guildOnly: false,
  ownerOnly: true,
  clientPerms: ['EMBED_LINKS'],

  async run(client, message, args) {

    const clean = (text) => {
      if (typeof (text) === 'string') { return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`); }
      return text;
    };

    try {
      const util = require('util');
      const code = args.join(' ');
      if(!code) return message.foxyReply("Executar nenhum código? WTF?! Como assim?");
      let evaled = eval(code);
      evaled = util.inspect(evaled, { depth: 1 });
      evaled = evaled.replace(new RegExp('Error', 'g'), undefined);

      if (evaled.length > 1800) evaled = `${evaled.slice(0, 1800)}...`;
      const sucess = new MessageEmbed()
        .setColor('RED')
        .setTitle('<:Developer:813832825442533396> Comando executado com sucesso!')
        .setDescription(`\ \ \`\`\`xl\n${clean(evaled)}\n\`\`\``);

      message.foxyReply(sucess);
    } catch (err) {
      const errorMessage = err.stack.length > 1800 ? `${err.stack.slice(0, 1800)}...` : err.stack;
      const code = args.join(' ');
      const embed = new MessageEmbed();
      embed.setColor('RED');
      embed.setTitle(`${client.emotes.scared} Ocorreu um erro durante a execução!`);
      embed.setDescription(`Saída: \`\`\`js\n${errorMessage}\`\`\``);

      message.foxyReply(embed);
    }
  },
};
