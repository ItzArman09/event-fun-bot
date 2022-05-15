const { permissionNames } = require('../validations/PermissionNames.js');
const { Client } = require('discord.js');
const { promisify } = require('util');
const { glob } = require('glob');
const promisedGlob = promisify(glob);
const ASCII = require('ascii-table');
const { guildId } = require('../config.json');

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    const table = new ASCII("Command Loader");

    global.commandsArray = [];

    (await promisedGlob(`${process.cwd()}/commands/*/*.js`)).map(async (file) => {
        const command = require(file);

        if(!command.name)
            return table.addRow(file.split('/')[5], "❌ Failed", "Missing name.");

        if(!command.description)
            return table.addRow(command.name, "❌ Failed", "Missing description.");

        if(command.permission) {
            if(permissionNames.includes(command.permission))
                command.defaultPermission = false;
            else
                return table.addRow(command.name, "❌ Failed", "Permission is invalid.");
        }

        client.commands.set(command.name, command);
        commandsArray.push(command);

        await table.addRow(command.name, "✔ Success");
    });

    console.log(table.toString());

    //Permissions Check

    client.on("ready", async () => {
        const mainGuild = await client.guilds.cache.get(guildId);
        if (!mainGuild) return console.error(`MainGuild Wasnt Found`);

        mainGuild.commands.set(commandsArray).then(async (cmd) => {
            const Roles = (cmdName) => {
                const cmdPerms = commandsArray.find((c) => c.name === cmdName).permission;
                if(!cmdPerms)
                    return null;

                return mainGuild.roles.cache.filter((r) => r.permissions.has(cmdPerms));
            };

            const fullPermissions = cmd.reduce((accumulator, r) => {
                const roles = Roles(r.name);
                if(!roles) return accumulator;

                const permissions = roles.reduce((a, r) => {
                    return [...a, {id: r.id, type: "ROLE", permission: true}];
                }, []);

                return [...accumulator, {id: r.id, permissions}];
            }, []);

            await mainGuild.commands.permissions.set({ fullPermissions });
        });
    });
}