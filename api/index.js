const express = require("express");
const fs = require("fs");
const { EventEmitter } = require("events");
const { join } = require("path");

const RoutesPath = join(__dirname, "Routes");

fs.readdir(RoutesPath, (err, files) => {
    if (err) return console.log(err);
    files.forEach((file) => {
        api.use("/api/" + file.split(".")[0], require(RoutesPath + "/" + file));
    });
});

api.use("/", static(join(__dirname, "..", "assets")));

//Handle Login and other stuff

const session = require("express-session");
const DiscordStrategy = require("passport-discord").Strategy;
const passport = require("passport");

let config;
try {
    //Config for testing
    config = require("../dev-config");
} catch {
    //Config for production
    config = require("../botconfig");
}

passport.use(
        new DiscordStrategy({
                clientID: config.ClientID,
                clientSecret: config.ClientSecret,
                callbackURL: config.Website + config.CallbackURL,
                scope: "identify guilds",
            },
            function(accessToken, refreshToken, profile, done) {
                //User logged in yay!
                process.nextTick(function() {
                    return done(null, profile);
                });

                this.app = express();

                //API
                fs.readdir(join(__dirname, "routes"), (err, files) => {
                    if (err) return console.log(err);
                    files.forEach((file) => {
                        this.app.use(
                            "/api/" + file.split(".")[0],
                            require(join(__dirname, "routes") + "/" + file)
                        );
                    });
                });
                fs.readdir(join(__dirname, "home"), (err, files) => {
                    if (err) return console.log(err);
                    files.forEach((file) => {
                        this.app.use(
                            "/" + file.split(".")[0],
                            require(join(__dirname, "home") + "/" + file)
                        );
                    });
                });
                this.app.use(express.static(join(__dirname, "..", "public")));
                // this.app.use((req, res) => {
                //   res.sendFile(join(__dirname, "..", "dashboard", "build", "index.html"));
                // });
            }

            listen() {
                this.app.listen(this.config.port);
            }
        }

        module.exports = Server;