const { addUser, removeUser, findUser, getAllUsers } = require("./userList");
const Message = require("../models/MessageModel");

const socketConnection = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`Connected: ${socket.id}`);

    socket.on("login", ({ _id, username }) => {
      // users.push({ socketId: socket.id, userId: _id, username });
      addUser(socket.id, _id, username);
      console.log("users:", getAllUsers());
    });

    socket.on("selectUser", ({ userId, username, selector }) => {
      const foundUser = findUser(userId);
      if (foundUser) {
        console.log(foundUser, "😄", socket.id);
        io.to(foundUser.socketId).emit("notifyUser", {
          action: "selected",
          userId,
          username,
          selector
        });
      }
    });

    socket.on("sendMessage", async (data) => {
      const { to } = data;

      try {
        if (data.message && data.to && data.from) {
          const newMessage = new Message({
            message: data.message,
            to: data.to,
            from: data.from,
            timestamp: data.timestamp,
          });

          newMessage.save();
        }
      } catch (err) {}

      const foundUser = findUser(to);
      console.log(data.message);
      if (foundUser) {
        io.to(foundUser.socketId).emit("getMessage", data);
      }
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log(`Disconnected: ${socket.id}`);
    });
  });
};

module.exports = { socketConnection };
