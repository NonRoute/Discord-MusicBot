module.exports = {
  cmdPerPage: 10, //Number of commands per page of help command
  adminId: "UserId", // Admin of the bot
  token: process.env.token || process.env['TOKEN'], //Bot's Token
  clientId: process.env.clientId || process.env['CLIENT_ID'], //ID of the bot
  clientSecret: process.env.clientSecret || process.env['CLIENT_SECRET'], //Client Secret of the bot
  port: 4200, //Port of the API and Dashboard
  scopes: ["identify", "guilds", "applications.commands"], //Discord OAuth2 Scopes
  serverDeafen: true, //If you want bot to stay deafened
  defaultVolume: 100, //Sets the default volume of the bot, You can change this number anywhere from 1 to 100
  supportServer: "https://discord.gg/sbySMS7m3v", //Support Server Link
  Issues: "https://github.com/SudhanPlayz/Discord-MusicBot/issues", //Bug Report Link
  permissions: 277083450689, //Bot Inviting Permissions
  disconnectTime: 1800000, //How long should the bot wait before disconnecting from the voice channel. in miliseconds. set to 1 for instant disconnect.
  alwaysplay: true, // when set to true music will always play no matter if theres no one in voice channel.
  debug: false, //Debug mode
  // Lavalink server; optional public lavalink -> https://lavalink-list.darrennathanael.com/
  // The default one should work fine.
  nodes: [
    {
      identifier: "Main", //- Used for indentifier in stats commands.
      host: "lavalink-replit.nonroute1.repl.co",
      port: 443,
      password: "maybeiwasboring",
      retryAmount: 200, //- The amount of times to retry connecting to the node if connection got dropped.
      retryDelay: 40, //- Delay between reconnect attempts if connection is lost.
      secure: true, //- Can be either true or false. Only use true if ssl is enabled!
    },
  ],
  embedColor: "ORANGE", //Color of the embeds, hex supported
  presence: {
    //PresenceData object | https://discord.js.org/#/docs/main/stable/typedef/PresenceData
    status: "online", // You can have online, idle, and dnd(invisible too but it make people think the bot is offline)
    activities: [
      {
        name: "You", //Status Text
        type: "LISTENING", // PLAYING, WATCHING, LISTENING, STREAMING
      },
    ],
  },
  iconURL: "https://images-ext-1.discordapp.net/external/orTaH_49eb1hAcY0RihITSFm4QghReZ6_66phxobYAE/https/i.pinimg.com/originals/c8/75/2a/c8752a100604c900269e1d21cfb9b0c7.gif", //This icon will be in every embed's author field
};
