const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bite')
        .setDescription('Morda alguém, só não arranque um pedaço ;)')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('O usuário que você quer beijar')
                .setRequired(true)),

    async execute(client, interaction) {

        const list = [
            'https://media1.tenor.com/images/f3f503705c36781b7f63c6d60c95a9d2/tenor.gif?itemid=17570122',
            'https://media1.tenor.com/images/6b42070f19e228d7a4ed76d4b35672cd/tenor.gif?itemid=9051585',
            'https://media1.tenor.com/images/83271613ed73fd70f6c513995d7d6cfa/tenor.gif?itemid=4915753',
            'https://i.pinimg.com/originals/4e/18/f4/4e18f45784b6b74598c56db4c8d10b4f.gif',
        ];

        const rand = list[Math.floor(Math.random() * list.length)];
        const user = interaction.options.getUser('user');

        const biteEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`${interaction.user} **Mordeu** ${user}`)
            .setImage(rand)
        await interaction.reply({ embeds: [biteEmbed] });
    }
}