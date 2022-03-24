module.exports = {
    token: process.env.token || process.env['TOKEN'], //Bot's Token
    clientId: process.env.clientId || process.env['CLIENT_ID'], //ID of the bot
    clientSecret: process.env.clientSecret || process.env['CLIENT_SECRET'], //Client Secret of the bot
    port: 3000, //Port of the API and Dashboard
    scopes: ["identify", "guilds", "applications.commands"], //Discord OAuth2 Scopes
    serverDeafen: true, //If you want bot to stay deafened
    defaultVolume: 100, //Sets the default volume of the bot, You can change this number anywhere from 1 to 100
    supportServer: "https://discord.gg/sbySMS7m3v", //Support Server Link
    Issues: "https://github.com/SudhanPlayz/Discord-MusicBot/issues", //Bug Report Link
    permissions: 826839002433, //Bot Inviting Permissions
    disconnectTime: 1800000, //How long should the bot wait before disconnecting from the voice channel. in miliseconds. set to 1 for instant disconnect.
    alwaysplay: true, // when set to true music will always play no matter if theres no one in voice channel.
    debug: false, //Debug mode
    // Lavalink server; optional public lavalink -> https://lavalink-list.darrennathanael.com/
    // The default one should work fine.
    nodes: [{
        identifier: "Main",
        host: "lavalink-replit.nonroute1.repl.co",
        port: 443,
        password: "maybeiwasboring",
        retryAmount: 100, //- Optional
        retryDelay: 30000, //- Optional
        secure: true //- Optional | Default: false
    }, ],
    embedColor: "RANDOM", //Color of the embeds, hex supported
    presence: {
        //PresenceData object | https://discord.js.org/#/docs/main/stable/typedef/PresenceData
        status: "online", // You can have online, idle, and dnd(invisible too but it make people think the bot is offline)
        activities: [{
            name: "Use Slash Commands", //Status Text
            type: "PLAYING", // PLAYING, WATCHING, LISTENING, STREAMING
        }, ],
    },
    iconURL: "https://cdn.darrennathanael.com/icons/spinning_disk.gif", //This icon will be in every embed's author field
};