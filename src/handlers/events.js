const { eventNames } = require('../validations/EventNames.js');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const ASCII = require("ascii-table");

module.exports = async (client) => {
    const table = new ASCII("Events Loader");

    (await PG(`${process.cwd()}/events/*/*.js`)).map(async (file) => {
        const event = require(file);

        if(!eventNames.includes(event.name) || !event.name) {
            const L = file.split("/");
            await table.addRow(`${event.name || "MISSING"}`, `❌ Event name is invalid or its missing: ${L[3] + `/` + L[4]}`);
            return;
        }

        if(event.once) {
            client.once(event.name, (...args) => event.run(client, ...args));
        } else {
            client.on(event.name, (...args) => event.run(client, ...args));
        }

        await table.addRow(event.name, `✔ Success`);
    });

    console.log(table.toString());
}