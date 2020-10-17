const Discord = require("discord.js");
const config = require('../config.json')

exports.run = async (client, message, args) => {
  message.delete().catch(O_o => {});
  if (!message.member.permissions.has("MANAGE_MESSAGES"))
    return message.reply(
      "<:Error:718944903886930013> você é fraco, lhe falta permissão de `Gerenciar Mensagens` para usar esse comando"
    );
  const deleteCount = parseInt(args[0], 10);
  if (!deleteCount || deleteCount < 1 || deleteCount > 99)
    return message.reply(
      "<:Alerta:718944960933527632> forneça um número de até **99 mensagens** a serem excluídas"
    );

  const fetched = await message.channel.messages.fetch({
    limit: deleteCount + 1
  });
  message.channel.bulkDelete(fetched);
  message.channel
    .send(`**${args[0]} mensagens limpas nesse chat!**`).then(msg => msg.delete({timeout: 5000}))
    .catch(error =>
      console.log(`Não foi possível deletar mensagens devido a: ${error}`)
    );
};