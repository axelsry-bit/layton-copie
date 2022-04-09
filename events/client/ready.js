const Logger = require("../../utils/Logger");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    Logger.client("- prêt à être utilisé");

    client.user.setPresence({
      activities: [{ name: "chilling with owner", type: "STREAMING" }],
      status: "dnd",
    });
    const devGuild = await client.guilds.cache.get(process.env.GUILD_ID);
    devGuild.commands.set(client.commands.map((cmd) => cmd));
  },
};
