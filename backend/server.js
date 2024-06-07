const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    // origin: "http://localhost:3000",
    origin: "*"
  },
  connectionStateRecovery: {},
});
const port = 3001;


const chats = [];
const players = [];
const word = "car";

app.use(cors());
app.use(express.json());

// app.get("/", (req, res) => {
//     res.send("The api is running seccessfully");
//   });

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  console.log("user connected", socket.id);
  // socket.join("room")

  // socket.on("player-joined",(id)=>{
  console.log("player joined with id", socket.id);
  players.push(socket.id);
  io.emit("updated-players", players);
  // })

  socket.on("sending", (data) => {
    // console.log("msg recievd",data)
    console.log("data received");
    socket.broadcast.emit("receiving", data);
  });

  socket.on("sending-chat", (inputMessage) => {
    const userID = socket.client.sockets.keys().next().value;
    console.log(userID);
    console.log("chat recieved", inputMessage);
    let rightGuess= false;
    if (inputMessage === word) {
      console.log("right guess");
      rightGuess=true;
      chats.push(`${userID} Guessed the right word`)
      // io.to(userID).emit("right-guess")
    }
    else{
      chats.push(inputMessage);
    }
    let returnObject={
        msg: inputMessage,
        userID: userID,
        rightGuess: rightGuess
    }
    io.emit("recieve-chat", returnObject);
  });

  socket.on("disconnect", (reason) => {
    // socket.leave(socket.id);
    // socket.disconnect();
    //   console.log(socket.id);
    console.log("USER DISCONNECTED IN DISCONNECT", socket.id);
    const index = players.indexOf(socket.id);
    if (index > -1) {
      // only splice array when item is found
      players.splice(index, 1); // 2nd parameter means remove one item only
    }
    io.emit("updated-players", players);
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port 3001`);
});
