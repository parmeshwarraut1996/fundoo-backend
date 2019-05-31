//requiring the http server
const http = require("http");
//require socket.io
var socketIO = require("socket.io");
//require express
const express = require("express");
var chatController = require("./controller/chatController");
const app = express();
const server = http.createServer(app);
var io = socketIO(server);
const bodyParser = require("body-parser");
const route = require("../server/routes/routes");
const dbConfig = require("./config/config.js");
const mongoose = require("mongoose");
var expressValidator = require("express-validator");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
//for listening the connection from client
io.on("connection", socket => {
  console.log("New user connected");
  //for listening the event
  socket.on("createMessage", message => {
    // console.log("message: in server is ", message);
    //for saving the message to database
    chatController.message(message, (err, data) => {
      if (err) {
        console.log("error---server.js 92", err);
      } else {
        //for sending message back to client
        io.emit("newMessageSingle", message);
      }
    });
    socket.on("disconnect", () => {
      console.log("User was disconnected");
    });
  });
});
app.use("/", route);
app.use(express.static("../client"));
// Connecting to the database
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });
// listen for requests
server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

//disconnect
