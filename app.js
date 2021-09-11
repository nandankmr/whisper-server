require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { socketConnection } = require("./socket/socketConnection");

const app = express();
const server = require("http").createServer(app);

const messageRouter = require("./routes/messageRoute");

mongoose.connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

const db = mongoose.connection;

socketConnection(server);

app.use(cors());

app.use(express.json());

const userRouter = require("./routes/user");


db.on("error", (e) => console.log(`error is ${e}`));
db.once("open", () => console.log("Database is connected"));

app.get("/", (req, res) => {
  console.log("req received");
  res.send("hello");
});

app.use("/user", userRouter);
app.use("/message", messageRouter);

const PORT = process.env.PORT || 8081;

server.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
