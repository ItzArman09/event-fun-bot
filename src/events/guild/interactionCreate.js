const { Client, CommandInteraction, MessageEmbed, MessageActionRow } = require('discord.js');
let fs = require('fs');

module.exports = {
    name: "interactionCreate",
    once: false,
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    run: async (client, interaction) => {
        if(interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if(!command) return interaction.reply({embeds: [
                new MessageEmbed()
                .setColor('DARK_RED')
                .setDescription('❌ There was a problem while executing this command.')
            ]}) && client.commands.delete(interaction.commandName);

            /*if(!cmdsEnabled.includes(command.name)) return interaction.reply({embeds: [
                new MessageEmbed()
                .setColor('DARK_RED')
                .setDescription('❌ This command was turned off.')
            ], ephemeral: true})*/

            command.run(client, interaction);
        }
    }
}