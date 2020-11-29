const { createServer } = require("http");
const express = require("express");
const { parse } = require("url");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();
const fs = require("fs");
const bodyParser = require("body-parser");
const socketIo = require("socket.io");

function readPlaylist(callback) {
  fs.readFile("lib/playlist.json", function (err, data) {
    if (err) {
      callback([]);
      console.log(`error reading from playlist`, err); // ofcourse there should be a more complex error handing (logger files etc...)
    }
    try {
      const playlist = JSON.parse(data);
      callback(playlist);
    } catch (err) {
      callback([]);
      console.log(`error parsing playlist`, err);
    }
  });
}

function writePlaylist(playlist, callback) {
  fs.writeFile(
    "lib/playlist.json",
    JSON.stringify(playlist),
    function (err, result) {
      if (err) {
        console.log(`error writing playlist ${result}`, err);
      }
      if (callback) {
        callback(err);
      }
    }
  );
}

nextApp.prepare().then(() => {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });
  const server = createServer(app);
  const io = socketIo(server);
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
  io.on("connection", (socket) => {
    readPlaylist((playlist) => {
      socket.emit("sendPlaylist", playlist);
    });
    socket.on("addToList", (url) => {
      readPlaylist((playlist) => {
        const newPlaylist = [...playlist, url];
        writePlaylist(newPlaylist, (err) => {
          if (!err) {
            socket.emit("sendPlaylist", newPlaylist);
          }
        });
      });
    });
    socket.on("removeFromPlaylist", (index) => {
      readPlaylist((playlist) => {
        const newPlaylist = [
          ...playlist.slice(0, index),
          ...playlist.slice(index + 1),
        ];

        writePlaylist(newPlaylist, (err) => {
          if (!err) {
            socket.emit("sendPlaylist", newPlaylist);
          }
        });
      });
    });
  });
});
