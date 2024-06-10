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
let word;
let drawerindex = 0;
let timeout;
let round=0;


const startGame=()=>{
  console.log("game started")
  io.emit("game-start",{})
  startTurn()
  
}

const stopGame=()=>{
  console.log("game stopped")

  io.emit("game-stop",{})
  drawerindex=0
  if(timeout){
    clearInterval(timeout)
  }
}

const startTurn=()=>{
  if(drawerindex>=players.length){
    drawerindex=0
  }
  //notify frontend for starting turn with this user
  io.emit("start-turn",players[drawerindex])
  //word genrator


}

const startDraw = ()=>{
  io.emit("start-draw",players[drawerindex])
  timeout = setTimeout(()=>{
    endTurn()
  }, 60000)

}

const endTurn=()=>{
  io.emit("end-turn", players[drawerindex])
  clearInterval(timeout)
  //notify turn ended for this user
  drawerindex=(drawerindex+1)%players.length
  //points logic
  startTurn(drawerindex)
}

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
  let newUser = {
    id: socket.id,
    name: "user",
    points: 0,
    avatar: ""
  }
  players.push(newUser);
  console.log(players)
  io.emit("updated-players", players);
  // })
  if(players.length==2){
    startGame()
  }
  if(players.length>=2){
    io.emit("game-already-started",{})
  }

  socket.on("sending", (data) => {
    // console.log("msg recievd",data)
    console.log("data received");
    socket.broadcast.emit("receiving", data);
  });

  socket.on("sending-chat", (inputMessage) => {
    const userID = socket.client.sockets.keys().next().value;
    console.log(userID);
    console.log("chat recieved", inputMessage);
    const index = players.findIndex(play => play.id === userID);
    let rightGuess= false;
    if (word && inputMessage && inputMessage === word) {
      console.log("right guess");
      rightGuess=true;
      if (index > -1) {
          players[index].points+=100
      }
      chats.push(`${userID} Guessed the right word`)
      // io.to(userID).emit("right-guess")
    }
    else{
      chats.push(inputMessage);
    }
    let returnObject={
        msg: inputMessage,
        player: players[index],
        rightGuess: rightGuess,
        players: players
    }
    io.emit("recieve-chat", returnObject);
  });


  socket.on("word-select",(w)=>{
    word=w
    let wl=w.length
    io.emit("word-len", wl)
    startDraw()


  })

  socket.on("disconnect", (reason) => {
    // socket.leave(socket.id);
    // socket.disconnect();
    //   console.log(socket.id);
    console.log("USER DISCONNECTED IN DISCONNECT", socket.id);
    const index = players.findIndex(play => play.id === socket.id);
    console.log(index)
    if (index > -1) {
      // only splice array when item is found
      players.splice(index, 1); // 2nd parameter means remove one item only
    }
    io.emit("updated-players", players);
    if(players.length<=1){
      stopGame()
    }

  });
});

server.listen(port, () => {
  console.log(`Example app listening on port 3001`);
});
