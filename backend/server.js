const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const dotenv = require("dotenv");

const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    // origin: "http://localhost:3000",
    origin: "*"
  },
  connectionStateRecovery: {},
});
// const port = 3001;

app.use(cors());
app.use(express.json());  
dotenv.config({path:'../.env'});



//--------DEPLOYMENT---------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "./frontend/build")));
  app.get("*", (req, res) => {
    // console.log(__dirname1)
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("The api is running seccessfully");
  });
}
//--------DEPLOYMENT---------


let port_no = process.env.PORT;

server.listen(port_no, () => {
  console.log(`Example app listening on port 3001`);
});



const chats = [];
const players = [];
let word;
let drawerindex = 0;
let timeout;
let round=0;
let playerGuessedRightWord=[]


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
  playerGuessedRightWord=[]
  clearInterval(timeout)
  //notify turn ended for this user
  drawerindex=(drawerindex+1)%players.length
  //points logic
  startTurn(drawerindex)
}





io.on("connection", (socket) => {
  console.log("connected to socket.io");
  console.log("user connected", socket.id);
  // socket.join("room")

  // socket.on("player-joined",(id)=>{
  console.log("player joined with id", socket.id);

  io.to(socket.id).emit("send-user-data",{})

  socket.on("recieve-user-data",({username, avatar})=>{
    let newUser = {
      id: socket.id,
      name: username,
      points: 0,
      avatar: avatar
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
  })
  

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
    if (word && inputMessage && inputMessage.toLowerCase() === word.toLowerCase()) {
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

    if(rightGuess){
      let u = playerGuessedRightWord.filter(pla=>pla===userID)
      console.log("u",u)
      if(u.length==0){
        playerGuessedRightWord.push(userID)
        if(playerGuessedRightWord.length===players.length-1){
          //emit to frontend for pause timer
          io.emit("all-guessed-correct",{})
          playerGuessedRightWord=[]
          endTurn()
        }
      }
    }
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
    console.log(reason)
    console.log("USER DISCONNECTED IN DISCONNECT", socket.id);
    const index = players.findIndex(play => play.id === socket.id);
    console.log(index)
    if (index > -1) {
      // only splice array when item is found
      players.splice(index, 1); // 2nd parameter means remove one item only
    }
    io.emit("updated-players", players);
    io.to(socket.id).emit("user-disconnected",{})
    if(players.length<=1){
      stopGame()
    }
  });
});

