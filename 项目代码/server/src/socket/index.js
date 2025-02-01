const { server } = require("@/index");
const { Server } = require("socket.io");
const Cookie = require("cookie");
const jwt = require("jsonwebtoken");
const db = require("@/db"); 

const io = new Server(server, {
  path: "/online-message",
  cors: "*",
});

io.use((socket, next) => {
  let cookie = Cookie.parse(socket.handshake.headers.cookie || "");
  let token = cookie.token || "";
  jwt.verify(token, "key", async function (err, decoded) {
    if (err) {
    } else {
      socket.id = decoded.id;
      next();
    }
  });
  next();
});
// 监听连接事件
module.exports = io;
