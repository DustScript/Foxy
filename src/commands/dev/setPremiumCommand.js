const user = require('../../structures/databaseConnection');

module.exports = {
    name: 'setpremium',
    aliases: ['setpremium'],
    onlyDevs: true,

    async run(client, message, args) {
        const userId = args[0];
        const premium = args[1];

        if (!userId) return message.channel.send('Coloque uma ID que esteja no banco de dados');
        if (!premium) return message.channel.send('Insira um valor premium true/false');

        const userData = await user.findOne({ user: userId });
        if(!userData) return message.foxyReply("Essa pessoa não está no meu banco de dados");
        userData.premium = premium;
        await userData.save();

        message.channel.send(`User ${userId}'s premium status has been set to ${premium}.`);
    }
}