import React, { useEffect, useState, useRef, useTransition } from "react";
import { io } from "socket.io-client";
import { Buffer } from "buffer";
import PlayerCard from "../components/PlayerCard";
import WordBar from "../components/WordBar";
import { wordsArray, getWordsArrayLength } from "../components/Words";

function PlayScreen() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [allChats, setAllChats] = useState([]);
  const [allPlayers, setAllPlayer] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentUserDrawing, setCurrentUserDrawing] = useState(false)
  const [gameStarted, setgameStarted] = useState(false)
  const [playerDrawing, setPlayerDrawing] = useState(null)
  const [showWords, setShowWords] = useState(false)
  const [words, setWords] = useState(["car", "bike", "cycle"])
  const [selectedWord, setSelectedWord] = useState(null)
  const [showClock, setShowClock] = useState(false)
  const [wordLen, setWordLen] = useState(0)
  const [guessedWord, setGuessedWord] = useState(false)
  useEffect(() => {
    const newSocket = io.connect("http://localhost:3001");
    // console.log(newSocket);
    setSocket(newSocket);
    // newSocket.emit("player-joined",newSocket.id)
    // return()=>{
    //   newSocket.disconnect();
    // }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("updated-players", (updatedplayers) => {
        console.log("updated Players", updatedplayers);
        setAllPlayer(updatedplayers);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      //  socket.on("drawing", ({ x0, y0, x1, y1, color })=>{
      //   // drawLine(context, x0, y0, x1, y1, color, false);
      //  })
      socket.on("receiving", async (data) => {
        //   console.log(data)
        // console.log("data recieved in frontend")

        //   const offsetX=data.x
        //   const offsetY=data.y

        // await context.lineTo(offsetX, offsetY);
        // await context.stroke();

        // await context.beginPath();
        // await context.arc(offsetX, offsetY,5,0,Math.PI*2)
        // await context.fill()
        // // context.stroke()
        // await context.beginPath();
        // await context.moveTo(offsetX, offsetY)
        // await context.stroke()
        // await context.beginPath()

        const base64String = data.split(",")[1];
        const buffer = Buffer.from(base64String, "base64");
        const byteArray = new Uint8Array(buffer);
        const blob = new Blob([byteArray], { type: "image/png" });
        const imageUrl = URL.createObjectURL(blob);

        const img = new Image();
        img.onload = () => {
          // if(context){
          context.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          context.drawImage(img, 0, 0);
          // }
        };
        img.src = imageUrl;
      });
    }
    //  return()=>{
    //   socket.disconnect()
    //  }
  }, [socket]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 10;
    setContext(ctx);
  }, []);

  useEffect(()=>{
    if(socket){
    socket.on("game-start",()=>{
      console.log("game started")
      setgameStarted(true)
    })
  }
  },[socket])

  useEffect(()=>{
    if(socket){
      socket.on("game-already-started",()=>{
        setgameStarted(true)
      })
    }
  },[socket])

  useEffect(()=>{
    if(socket){
    socket.on("game-stop",()=>{
      console.log("game stopped")
      setgameStarted(false)
      setShowClock(false)
      setCurrentUserDrawing(false)
      setPlayerDrawing(null)

    })
  }
  },[socket])


  useEffect(()=>{
    if(socket){
      socket.on("start-turn",(player)=>{
        console.log("turn started of", player)
        setGuessedWord(false)
        clearCanvas()
        setPlayerDrawing(player)
        //getwiords function call
        let newRandomWords = getRandomWords()
        setWords(newRandomWords)
        setShowWords(true)


      })
    }

  },[socket])

  useEffect(()=>{
    if(socket){
      socket.on("word-len",(wl)=>{
        console.log("selected word length", wl)
        setWordLen(wl)
      })
    }
  },[socket])


  useEffect(()=>{
    if(socket){
    socket.on("start-draw",(player)=>{
      console.log("drawing started of", player)
      setShowWords(false)
      setShowClock(true)
      clearCanvas()
      // setPlayerDrawing(player)
      if(player.id===socket.id){
        console.log("your turn started")
        setCurrentUserDrawing(true)
      }
    })
  }
  },[socket])

  useEffect(()=>{
    if(socket){
      socket.on("all-guessed-correct",()=>{
        console.log("all players guessed the word correct, end the timer")
      })
    }

  },[socket])

  useEffect(()=>{
    if(socket){
    socket.on("end-turn",(player)=>{
      console.log("turn ended of", player)
      setGuessedWord(false)
      setPlayerDrawing(null)
      setShowClock(false)
      setSelectedWord(null)
      if(socket.id===player.id){
        console.log("your turn ended!")
        setCurrentUserDrawing(false)
      }
    })
  }
  },[socket])

  useEffect(() => {
    if (socket) {
      socket.on("recieve-chat", ({ msg, player, rightGuess,players }) => {
        console.log(msg, player, rightGuess, players);
        setAllPlayer(players)
        if (rightGuess) {
          // will be adding an attr to chat object later for the green colour
          // one option that can be further explored is that push the messages in efrontend withut sending all chats from the backend
          if (player.id === socket.id) {
            // chats.pop();
            setGuessedWord(true)
            setAllChats(prevchats=>[{sender: "you", message:`you guessed the right word! (${msg})`, rightGuess}, ...prevchats]);
          }else{
            setAllChats(prevchats=>[{sender:player.name, message:`${player.name} guessed the word right!`, rightGuess}, ...prevchats])

          }
        }else{
          if (player.id === socket.id) {
            // allChats.push({sender: "you", message: inputMessage})
            // setAllChats([...allChats, {sender: "you", message: inputMessage}])
            // console.log(allChats)
            // allChats.push({sender: "you", message: msg})
            // let newChats = [...allChats]
            // console.log(newChats)
            // let newChat = {sender: "you", message: msg}
            // newChats.push(newChat)
            // console.log(newChats)
            // setAllChats(newChats)
            setAllChats(prevchats=>[{sender: "you", message: msg, rightGuess}, ...prevchats])

          }else{

            setAllChats(prevchats=>[ {sender: player.name, message: msg, rightGuess},...prevchats])
          }
        }
        // setAllChats(chats.reverse());
      });
    }
  }, [socket]);

  // useEffect(()=>{
  //     if(socket){
  //       socket.on("right-guess",()=>{
  //         console.log("Congratulations! you guessed the right word")
  //       })
  //     }
  // },[socket])

  const putpoint = async (event) => {
    if (!isDrawing || !currentUserDrawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    context.lineTo(offsetX, offsetY);
    context.stroke();
    context.beginPath();
    context.arc(offsetX, offsetY, 5, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.moveTo(offsetX, offsetY);
    // socket.emit("sending",{x:offsetX, y:offsetY})
    const dataURL = await canvasRef.current.toDataURL("image/png");
    socket.emit("sending", dataURL);
  };

  const startDrawing = (event) => {
    // console.log(event)
    setIsDrawing(true);
    // const { offsetX, offsetY } = event.nativeEvent;
    // context.beginPath();
    // context.moveTo(offsetX, offsetY);
    // context.lineTo(offsetX, offsetY);
    putpoint(event);
  };

  const draw = (event) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    // const { x, y } = event.nativeEvent;
    // drawLine(context, x, y, offsetX, offsetY, '#000000', true);
    // context.moveTo(offsetX, offsetY);
    context.lineTo(offsetX, offsetY);
    context.stroke();

    // socket.emit("sending",{x:offsetX, y:offsetY})
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    // context.closePath();
    context.beginPath();
  };

  const handleChangeText=(e)=>{
    setInputMessage(e.target.value)

  }
  const handleSubmitForm=(e)=>{

    e.preventDefault()
    if(!inputMessage){
        return
    }
    console.log(inputMessage)
    socket.emit("sending-chat",inputMessage)
    console.log("socekt in send msg:", socket.id)
    setInputMessage('')
  }


  const clearCanvas = ()=>{
    if(context){
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  const handleWorSelect=(w)=>{
    setShowWords(false)
    setSelectedWord(w)
    //emit to bacikend this wordd
    socket.emit("word-select", w)
    setWords([])
  }


  const getRandomWords=()=>{
    let lengthWordArray = getWordsArrayLength()
    let newWordsArray = []
    let newIndex;
    let prevIndex = -1;
    for(let i=0; i<3; i++){
      newIndex = Math.floor(Math.random()*lengthWordArray)

      while(newIndex===prevIndex){
        newIndex = Math.floor(Math.random()*lengthWordArray)
      }
      newWordsArray.push(wordsArray[newIndex])
      prevIndex=newIndex

    }
    console.log(newWordsArray)
    return newWordsArray

  }

  return (
    // <div>PlayScreen</div>
    <div className=" relative w-screen h-screen ">
      <div className="w-full h-full   flex flex-col  justify-center items-center gap-4">
        <div>
        <WordBar showClock={showClock} wordLen={wordLen} gameStarted={gameStarted} showWords={showWords} currentUserDrawing={currentUserDrawing} selectedWord={selectedWord} />
        </div>
        <div className=" w-full flex justify-center items-center gap-10">
        <div className=" w-[300px] h-[540px] border border-black bg-white text-black  ">
          {allPlayers && allPlayers.map((pl,idx)=>(
            // <p key={idx}>{pl}</p>
            <PlayerCard key={idx} pl={pl} curruser={pl.id===socket.id} playerDrawing={playerDrawing} />
          ))}
        </div>
        <div className="relative w-[680px] h-[540px] bg-yellow-50">
          <canvas
            ref={canvasRef}
            width={680}
            height={540}
            style={{ border: "1px solid #000" }}
            onMouseDown={startDrawing}
            onMouseMove={putpoint}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className={`${!currentUserDrawing?"cursor-not-allowed":""}`}
          />
          { showWords && playerDrawing && playerDrawing.id===socket.id &&
          <div className="absolute top-0 left-0 h-full w-full flex justify-center gap-10 items-center z-10 bg-white bg-opacity-80">
            {words.map((w,idx)=>(
              <div onClick={()=>{handleWorSelect(w)}} key={idx} className=" text-black text-center w-36 h-7 border-2 rounded-md border-black">{w}</div>
            ))}

          </div>
}

{ showWords && playerDrawing && playerDrawing.id!==socket.id &&
          <div className=" text-black absolute h-full w-full top-0 left-0 flex justify-center items-center z-10 bg-white bg-opacity-80">
            {`${playerDrawing.name} is choosing a word`}
          </div>
}

        </div>
        <div className=" w-[300px] h-[540px] border border-black flex flex-col-reverse rounded-b-lg p-1 ">

        <form
        // className=" m-1"
            onSubmit={(e) => {
              handleSubmitForm(e);
            }}
          >
            <input
              value={inputMessage}
              placeholder="Type your guess here"
              className={`min-w-full active max-w-full text-black flex flex-wrap px-6 py-2 rounded-lg font-medium bg-sky-50  bg-opacity-40 border border-blue-300 placeholder-gray-400 text-md focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-0 focus:shadow-[0_0px_10px_2px_#bfdbfe] ${currentUserDrawing || showWords || !gameStarted?"cursor-not-allowed":""}`}
              onChange={(e) => handleChangeText(e)}
              disabled={currentUserDrawing || showWords || !gameStarted|| guessedWord}
            ></input>
          </form>

          {allChats && allChats.length>0 && allChats.map((chat, idx) => <p className={`${chat.rightGuess?"bg-green-200 text-green-600":""}`} key={idx}>{
            `${chat.rightGuess?chat.message:`${chat.sender}: ${chat.message}`}`
          // `${chat.sender}: ${chat.message}`
        // chat
          }</p>)}
        </div>
        </div>
      </div>
    </div>
  );
}

export default PlayScreen;
