const { createServer } = require("http");
const express = require("express");
const { parse } = require("url");
const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const fs = require("fs");
const bodyParser = require("body-parser");

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

function writePlaylist(playlist) {
  fs.writeFile(
    "lib/playlist.json",
    JSON.stringify(playlist),
    function (err, result) {
      if (err) {
        console.log(`error writing playlist ${result}`, err);
      }
    }
  );
}

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());
  server.get("/getPlaylist", (req, res) => {
    readPlaylist((playlist) => {
      res.send(playlist);
    });
    return;
  });
  server.post("/addToPlaylist", (req, res) => {
    const { url } = req.body;
    readPlaylist((playlist) => {
      writePlaylist([...playlist, url]);
    });
    return;
  });
  server.post("/removeFromPlaylist", (req, res) => {
    const { index, url } = req.body;
    readPlaylist((playlist) => {
      if (playlist[index] == url) {
        // important check because clients can try to delete an item that as already been deleted by another client
        writePlaylist([
          ...playlist.slice(0, index),
          ...playlist.slice(index + 1),
        ]);
      }
    });
    return;
  });
  server.get("*", (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    app.render(req, res, pathname, query);
  });
  createServer(server).listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
