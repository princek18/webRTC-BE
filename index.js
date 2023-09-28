require("./src/db.js");
const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const cors = require("cors");
const userRouter = require("./src/Routes/UserRoute.js");
const socketController = require("./src/SocketControllers/Controller.js");

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(userRouter);

io.on("connection", socketController);

server.listen(process.env.PORT, () => {
  console.log(`Server Started on ${process.env.PORT}`);
});
