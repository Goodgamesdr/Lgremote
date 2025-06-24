const express = require("express");
const bodyParser = require("body-parser");
const WebSocket = require("ws");
const { exec } = require("child_process");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let tvIP = null;
let socket = null;

app.get("/discover", (req, res) => {
  exec("arp -a", (err, stdout) => {
    // Fake discovery logic
    const fakeIP = "192.168.1.123";
    tvIP = fakeIP;
    res.json({ ip: fakeIP });
  });
});

app.post("/pair", (req, res) => {
  const { code } = req.body;
  // Normally validate the code
  if (tvIP) {
    socket = new WebSocket(`ws://${tvIP}:3000`);
    socket.on("open", () => res.json({ success: true }));
  } else res.json({ success: false });
});

const commandMap = {
  volumeUp: "VOLUMEUP",
  volumeDown: "VOLUMEDOWN",
  channelUp: "CHANNELUP",
  channelDown: "CHANNELDOWN",
  up: "UP",
  down: "DOWN",
  left: "LEFT",
  right: "RIGHT",
  ok: "ENTER",
  back: "BACK",
  home: "HOME",
  power: "POWER",
  launchYouTube: "youtube.leanback.v4",
  launchNetflix: "netflix"
};

app.post("/command", (req, res) => {
  const { command } = req.body;
  if (!socket || socket.readyState !== 1) return res.status(500).send("Not connected");

  if (command.startsWith("launch")) {
    socket.send(JSON.stringify({ type: "launch", appId: commandMap[command] }));
  } else {
    socket.send(JSON.stringify({ type: "button", name: commandMap[command] }));
  }
  res.send("OK");
});

app.listen(PORT, () => console.log(`Proxy listening on http://localhost:${PORT}`));
