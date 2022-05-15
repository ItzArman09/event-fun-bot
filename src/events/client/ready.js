module.exports = {
    name: "ready",
    once: true,
    run: async (client) => {
        await console.log(client.user.tag + " is ready");
    }
}