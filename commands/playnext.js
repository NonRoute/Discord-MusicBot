const { Util, MessageEmbed } = require("discord.js");
const { TrackUtils, Player } = require("erela.js");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  name: "playnext",
  description: "Play your favorite songs in next position",
  usage: "[song]",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["pn"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **You must be in a voice channel to play something!**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        ":x: | **You must be in the same voice channel as me to use this command!**"
      );
    let SearchString = args.join(" ");
    if (!SearchString)
      return client.sendTime(
        message.channel,
        `**Usage - **\`${GuildDB.prefix}play [song]\``
      );
    let CheckNode = client.Manager.nodes.get(client.botconfig.Lavalink.id);
    let Searching = await message.channel.send(":mag_right: Searching...");
    if (!CheckNode || !CheckNode.connected) {
      return client.sendTime(
        message.channel,
        "❌ | **Lavalink node not connected**"
      );
    }
    const player = client.Manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: client.botconfig.ServerDeafen,
      volume: client.botconfig.DefaultVolume,
    });

    let SongAddedEmbed = new MessageEmbed().setColor(
      client.botconfig.EmbedColor
    );

    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Nothing is playing right now...**"
      );

    if (player.state != "CONNECTED") await player.connect();

    try {
      if (SearchString.match(client.Lavasfy.spotifyPattern)) {
        await client.Lavasfy.requestToken();
        let node = client.Lavasfy.nodes.get(client.botconfig.Lavalink.id);
        let Searched = await node.load(SearchString);

        if (Searched.loadType === "PLAYLIST_LOADED") {
          return client.sendTime(
            message.channel,
            "❌ | **You cannot use this command with playlist!**"
          );
        } else if (Searched.loadType.startsWith("TRACK")) {
          player.queue.add(
            TrackUtils.build(Searched.tracks[0], message.author)
          );
          if (!player.playing && !player.paused && !player.queue.size)
            player.play();
          SongAddedEmbed.setAuthor(`Added to queue`, client.botconfig.IconURL);
          SongAddedEmbed.setDescription(
            `[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`
          );
          SongAddedEmbed.addField(
            "Author",
            Searched.tracks[0].info.author,
            true
          );
          //SongAddedEmbed.addField("Duration", `\`${prettyMilliseconds(Searched.tracks[0].length, { colonNotation: true })}\``, true);
          if (player.queue.totalSize > 1) {
            SongAddedEmbed.addField("Position in queue", `${1}`, true);
            Searching.edit(SongAddedEmbed);
            let trackNum = player.queue.size - 1;
            const track = player.queue[trackNum];
            player.queue.splice(trackNum, 1);
            player.queue.unshift(track);
          }
        } else {
          return client.sendTime(
            message.channel,
            "**No matches found for - **" + SearchString
          );
        }
      } else {
        let Searched = await player.search(SearchString, message.author);
        if (!player)
          return client.sendTime(
            message.channel,
            "❌ | **Nothing is playing right now...**"
          );

        if (Searched.loadType === "NO_MATCHES")
          return client.sendTime(
            message.channel,
            "**No matches found for - **" + SearchString
          );
        else if (Searched.loadType == "PLAYLIST_LOADED") {
          return client.sendTime(
            message.channel,
            "❌ | **You cannot use this command with playlist!**"
          );
        } else {
          player.queue.add(Searched.tracks[0]);
          if (!player.playing && !player.paused && !player.queue.size)
            player.play();
          SongAddedEmbed.setAuthor(`Added to queue`, client.botconfig.IconURL);

          // SongAddedEmbed.setThumbnail(Searched.tracks[0].displayThumbnail());
          SongAddedEmbed.setDescription(
            `[${Searched.tracks[0].title}](${Searched.tracks[0].uri})`
          );
          SongAddedEmbed.addField("Author", Searched.tracks[0].author, true);
          SongAddedEmbed.addField(
            "Duration",
            `\`${prettyMilliseconds(Searched.tracks[0].duration, {
              colonNotation: true,
            })}\``,
            true
          );
          if (player.queue.totalSize > 1) {
            SongAddedEmbed.addField("Position in queue", `${1}`, true);
            Searching.edit(SongAddedEmbed);
            let trackNum = player.queue.size - 1;
            const track = player.queue[trackNum];
            player.queue.splice(trackNum, 1);
            player.queue.unshift(track);
          }
        }
      }
    } catch (e) {
      console.log(e);
      return client.sendTime(
        message.channel,
        "**No matches found for - **" + SearchString
      );
    }
  },

  SlashCommand: {
    options: [
      {
        name: "song",
        value: "song",
        type: 3,
        required: true,
        description: "Play music in the voice channel",
      },
    ],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);
      const voiceChannel = member.voice.channel;
      let awaitchannel = client.channels.cache.get(interaction.channel_id);
      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | **You must be in a voice channel to use this command.**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          ":x: | **You must be in the same voice channel as me to use this command!**"
        );
      let CheckNode = client.Manager.nodes.get(client.botconfig.Lavalink.id);
      if (!CheckNode || !CheckNode.connected) {
        return client.sendTime(
          interaction,
          "❌ | **Lavalink node not connected**"
        );
      }

      let player = client.Manager.create({
        guild: interaction.guild_id,
        voiceChannel: voiceChannel.id,
        textChannel: interaction.channel_id,
        selfDeafen: client.botconfig.ServerDeafen,
        volume: client.botconfig.DefaultVolume,
      });
      if (player.state != "CONNECTED") await player.connect();
      let search = interaction.data.options[0].value;
      let res;

      if (search.match(client.Lavasfy.spotifyPattern)) {
        await client.Lavasfy.requestToken();
        let node = client.Lavasfy.nodes.get(client.botconfig.Lavalink.id);
        let Searched = await node.load(search);

        switch (Searched.loadType) {
          case "LOAD_FAILED":
            if (!player.queue.current) player.destroy();
            return client.sendError(
              interaction,
              `❌ | **There was an error while searching**`
            );

          case "NO_MATCHES":
            if (!player.queue.current) player.destroy();
            return client.sendTime(
              interaction,
              "❌ | **No results were found.**"
            );
          case "TRACK_LOADED":
            player.queue.add(TrackUtils.build(Searched.tracks[0], member.user));
            if (!player.playing && !player.paused && !player.queue.length)
              player.play();
            let SongAddedEmbed = new MessageEmbed();
            SongAddedEmbed.setAuthor(
              `Added to queue`,
              client.botconfig.IconURL
            );
            SongAddedEmbed.setColor(client.botconfig.EmbedColor);
            SongAddedEmbed.setDescription(
              `[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`
            );
            SongAddedEmbed.addField(
              "Author",
              Searched.tracks[0].info.author,
              true
            );
            if (player.queue.totalSize > 1) {
              SongAddedEmbed.addField("Position in queue", `${1}`, true);
              let trackNum = player.queue.size - 1;
              const track = player.queue[trackNum];
              player.queue.splice(trackNum, 1);
              player.queue.unshift(track);
              return interaction.send(SongAddedEmbed);
            }

          case "SEARCH_RESULT":
            player.queue.add(TrackUtils.build(Searched.tracks[0], member.user));
            if (!player.playing && !player.paused && !player.queue.length)
              player.play();
            let SongAdded = new MessageEmbed();
            SongAdded.setAuthor(`Added to queue`, client.botconfig.IconURL);
            SongAdded.setColor(client.botconfig.EmbedColor);
            SongAdded.setDescription(
              `[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`
            );
            SongAdded.addField("Author", Searched.tracks[0].info.author, true);
            if (player.queue.totalSize > 1) {
              SongAdded.addField("Position in queue", `${1}`, true);
              let trackNum = player.queue.size - 1;
              const track = player.queue[trackNum];
              player.queue.splice(trackNum, 1);
              player.queue.unshift(track);
              return interaction.send(SongAdded);
            }

          case "PLAYLIST_LOADED":
            let embed = new MessageEmbed().setDescription(
              "❌ | **You cannot use this command with playlist!**"
            );
            return interaction.send(embed);
        }
      } else {
        try {
          res = await player.search(search, member.user);
          if (res.loadType === "LOAD_FAILED") {
            if (!player.queue.current) player.destroy();
            return client.sendError(
              interaction,
              `:x: | **There was an error while searching**`
            );
          }
        } catch (err) {
          return client.sendError(
            interaction,
            `There was an error while searching: ${err.message}`
          );
        }
        switch (res.loadType) {
          case "NO_MATCHES":
            if (!player.queue.current) player.destroy();
            return client.sendTime(
              interaction,
              "❌ | **No results were found.**"
            );
          case "TRACK_LOADED":
            player.queue.add(res.tracks[0]);
            if (!player.playing && !player.paused && !player.queue.length)
              player.play();
            let SongAddedEmbed = new MessageEmbed();
            SongAddedEmbed.setAuthor(
              `Added to queue`,
              client.botconfig.IconURL
            );
            //SongAddedEmbed.setThumbnail(res.tracks[0].displayThumbnail());
            SongAddedEmbed.setColor(client.botconfig.EmbedColor);
            SongAddedEmbed.setDescription(
              `[${res.tracks[0].title}](${res.tracks[0].uri})`
            );
            SongAddedEmbed.addField("Author", res.tracks[0].author, true);
            SongAddedEmbed.addField(
              "Duration",
              `\`${prettyMilliseconds(res.tracks[0].duration, {
                colonNotation: true,
              })}\``,
              true
            );
            if (player.queue.totalSize > 1) {
              SongAddedEmbed.addField("Position in queue", `${1}`, true);
              let trackNum = player.queue.size - 1;
              const track = player.queue[trackNum];
              player.queue.splice(trackNum, 1);
              player.queue.unshift(track);
              return interaction.send(SongAddedEmbed);
            }

          case "PLAYLIST_LOADED":
            let embed = new MessageEmbed().setDescription(
              "❌ | **You cannot use this command with playlist!**"
            );
            return interaction.send(embed);
          case "SEARCH_RESULT":
            const track = res.tracks[0];
            player.queue.add(track);

            if (!player.playing && !player.paused && !player.queue.length) {
              let SongAddedEmbed = new MessageEmbed();
              SongAddedEmbed.setAuthor(
                `Added to queue`,
                client.botconfig.IconURL
              );
              SongAddedEmbed.setThumbnail(track.displayThumbnail());
              SongAddedEmbed.setColor(client.botconfig.EmbedColor);
              SongAddedEmbed.setDescription(`[${track.title}](${track.uri})`);
              SongAddedEmbed.addField("Author", track.author, true);
              SongAddedEmbed.addField(
                "Duration",
                `\`${prettyMilliseconds(track.duration, {
                  colonNotation: true,
                })}\``,
                true
              );
              if (player.queue.totalSize > 1)
                SongAddedEmbed.addField(
                  "Position in queue",
                  `${player.queue.size - 0}`,
                  true
                );
              player.play();
              return interaction.send(SongAddedEmbed);
            } else {
              let SongAddedEmbed = new MessageEmbed();
              SongAddedEmbed.setAuthor(
                `Added to queue`,
                client.botconfig.IconURL
              );
              SongAddedEmbed.setThumbnail(track.displayThumbnail());
              SongAddedEmbed.setColor(client.botconfig.EmbedColor);
              SongAddedEmbed.setDescription(`[${track.title}](${track.uri})`);
              SongAddedEmbed.addField("Author", track.author, true);
              SongAddedEmbed.addField(
                "Duration",
                `\`${prettyMilliseconds(track.duration, {
                  colonNotation: true,
                })}\``,
                true
              );
              if (player.queue.totalSize > 1) {
                SongAddedEmbed.addField("Position in queue", `${1}`, true);
                let trackNum = player.queue.size - 1;
                const track = player.queue[trackNum];
                player.queue.splice(trackNum, 1);
                player.queue.unshift(track);
                interaction.send(SongAddedEmbed);
              }
            }
        }
      }
    },
  },
};
