const user = require('../structures/databaseConnection')
const Discord = require('discord.js');
const { permissionsLocale } = require("../json/permissionsLocale.json");
const cooldowns = new Discord.Collection();
module.exports = async (client, message) => {

  if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) message.channel.send(`Olá ${message.author}! Meu nome é ${client.user.username}, meu prefixo é \`${client.config.prefix}\`, Utilize \`${client.config.prefix}help\` para obter ajuda! ${client.emotes.success}`);

  const prefixRegex = new RegExp(`^(${client.config.prefix}|<@!?${client.user.id}>)( )*`, "gi");

  if (!message.content.match(prefixRegex) || message.author.bot || message.webhookID) return;
  const args = message.content.replace(prefixRegex, "").trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;


  function FoxyHandler() {
    if (command.guildOnly && message.channel.type === 'dm') {
      return message.foxyReply(`<:Error:718944903886930013> | ${message.author} Esse comando não pode ser executado em mensagens diretas!`);
    }

    if (command.ownerOnly && !client.config.owners.includes(message.author.id)) {
      return message.foxyReply(`<:Error:718944903886930013> | ${message.author} Você não tem permissão para fazer isso! <:meow_thumbsup:768292477555572736>`);
    }

    if (message.channel.type !== 'dm' || message.channel.type === 'text') {
      const guildMember = Object(message.guild.members.cache.get(client.user.id));
      const userMember = Object(message.guild.members.cache.get(message.author.id));

      if (command.clientPerms && !message.guild.members.cache.get(client.user.id).permissions.has(command.clientPerms)) {
        let missingPermissions = [];
        for (const permission of command.clientPerms) {
          if (!guildMember.permissions.has(permission)) {
            const permissionName = permissionsLocale.find((index) => index.id == permission);
            missingPermissions.push(permissionName.name);
          }
        }

        return message.channel.send(`${client.emotes.error} **|** ${message.author} Infelizmente esse comando não pode ser executado, eu preciso das permissões: \`${missingPermissions.join(", ")}\` :c`);
      }


      if (command.userPerms && !message.guild.members.cache.get(message.author.id).permissions.has(command.userPerms)) {
        let missingPermissions = [];
        for (const permission of command.userPerms) {
          if (!userMember.permissions.has(permission)) {
            const permissionName = permissionsLocale.find((index) => index.id == permission);
            missingPermissions.push(permissionName.name)
          }
        }

        return message.channel.send(`${client.emotes.otter} **|** ${message.author} Você precisa das permissões ${missingPermissions.join(", ")} para executar esse comando!`)
      }
    }


    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        let time = `${timeLeft.toFixed(0)} segundos`;
        if (time <= 0) time = "Alguns milisegundos";
        return;
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    command.run(client, message, args);

  } try {
    user.findOne({ user: message.author.id }, (stderr, data) => {
      if (stderr) return console.error(`Algo deu errado! ${stderr}`);
      if (data) return FoxyHandler();

      new user({
        user: message.author.id,
        coins: 0,
        lastDaily: null,
        reps: 0,
        lastRep: null,
        backgrounds: ['default.png'],
        background: 'default.png',
        aboutme: null,
        marry: null,
        premium: false,
      }).save().catch(err => console.log(err));
    });
    return FoxyHandler();
  } catch (error) {
    console.log(error);
  }
};