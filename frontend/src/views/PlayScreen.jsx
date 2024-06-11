import React, { useEffect, useState, useRef, useTransition } from "react";
import { io } from "socket.io-client";
import { Buffer } from "buffer";
import PlayerCard from "../components/PlayerCard";
import WordBar from "../components/WordBar";
import { wordsArray, getWordsArrayLength } from "../components/Words";
import { useNavigate, useLocation } from "react-router-dom";

function PlayScreen() {
  const canvasRef = useRef(null);
  const [isPainting, setIsPainting] = useState(false);
  const [mousePosition, setMousePosition] = useState(undefined);
  const [color, setColor] = useState("#000000"); // Default color is black
  const [startPoint, setStartPoint] = useState(null);
  const [lines, setLines] = useState([]); // Array to store drawn lines
  const [straightLineMode, setStraightLineMode] = useState(false); // Straight line drawing mode
  const [radius, setRadius] = useState(5); // Default radius is 5
  const [isEraser, setIsEraser] = useState(false); // Default is drawing mode
  const [context, setContext] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [allChats, setAllChats] = useState([]);
  const [allPlayers, setAllPlayer] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentUserDrawing, setCurrentUserDrawing] = useState(false);
  const [gameStarted, setgameStarted] = useState(false);
  const [playerDrawing, setPlayerDrawing] = useState(null);
  const [showWords, setShowWords] = useState(false);
  const [words, setWords] = useState(["car", "bike", "cycle"]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [showClock, setShowClock] = useState(false);
  const [wordLen, setWordLen] = useState(0);
  const [guessedWord, setGuessedWord] = useState(false);
  const navigate = useNavigate()
  const location = useLocation()
  const userDataRecieved = location.state || {};
  const ENDPOINT = "https://skribblay-you.onrender.com/";
  const ENDPOINT_LOCAL = "http://localhost:3001/";
  useEffect(() => {
    console.log("user Data revcievd", userDataRecieved)
    let us = localStorage.getItem("username")
    if(!us || !userDataRecieved.username || !userDataRecieved.avatar){
      navigate("/")
      return;
    }
    const newSocket = io.connect(process.env.REACT_APP_NODE_ENV === "production"
    ? ENDPOINT
    : ENDPOINT_LOCAL, );
    // console.log(newSocket);
    setSocket(newSocket);
    // newSocket.emit("player-joined",newSocket.id)

    window.onbeforeunload=()=>{
      localStorage.removeItem("username");
    };
    return()=>{
      if(newSocket){
      newSocket.disconnect();
      }
      localStorage.removeItem("username")
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("updated-players", (updatedplayers) => {
        console.log("updated Players", updatedplayers);
        setAllPlayer(updatedplayers);
      });
    }
  }, [socket]);

  useEffect(()=>{
    if(socket){
      socket.on("send-user-data",()=>{
        console.log("sending user data")
        let userdata= {
          username: userDataRecieved.username,
          avatar: userDataRecieved.avatar
        }
        socket.emit("recieve-user-data",userdata)
      })
    }

  },[socket])

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

    setContext(ctx);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineWidth = radius; // Set initial radius
    ctx.strokeStyle = color; // Set initial color
    setContext(ctx);
  }, [color, radius]);
  useEffect(() => {
    if (socket) {
      socket.on("game-start", () => {
        console.log("game started");
        setgameStarted(true);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("game-already-started", () => {
        setgameStarted(true);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("game-stop", () => {
        console.log("game stopped");
        setgameStarted(false);
        setShowClock(false);
        setCurrentUserDrawing(false);
        setPlayerDrawing(null);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("start-turn", (player) => {
        console.log("turn started of", player);
        setGuessedWord(false);
        clearCanvasAfterTurn(); // setPlayerDrawing(player)
        setPlayerDrawing(player);
        //getwiords function call
        let newRandomWords = getRandomWords();
        setWords(newRandomWords);
        setShowWords(true);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("word-len", (wl) => {
        console.log("selected word length", wl);
        setWordLen(wl);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("start-draw", (player) => {
        console.log("drawing started of", player);
        setShowWords(false);
        setShowClock(true);
        clearCanvasAfterTurn(); // setPlayerDrawing(player)
        // setPlayerDrawing(player)
        if (player.id === socket.id) {
          console.log("your turn started");
          setCurrentUserDrawing(true);
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("all-guessed-correct", () => {
        console.log("all players guessed the word correct, end the timer");
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("end-turn", (player) => {
        console.log("turn ended of", player);
        setGuessedWord(false);
        setPlayerDrawing(null);
        setShowClock(false);
        setSelectedWord(null);
        if (socket.id === player.id) {
          console.log("your turn ended!");
          setCurrentUserDrawing(false);
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("recieve-chat", ({ msg, player, rightGuess, players }) => {
        console.log(msg, player, rightGuess, players);
        setAllPlayer(players);
        if (rightGuess) {
          // will be adding an attr to chat object later for the green colour
          // one option that can be further explored is that push the messages in efrontend withut sending all chats from the backend
          if (player.id === socket.id) {
            // chats.pop();
            setGuessedWord(true);
            setAllChats((prevchats) => [
              {
                sender: "you",
                message: `you guessed the right word! (${msg})`,
                rightGuess,
              },
              ...prevchats,
            ]);
          } else {
            setAllChats((prevchats) => [
              {
                sender: player.name,
                message: `${player.name} guessed the word right!`,
                rightGuess,
              },
              ...prevchats,
            ]);
          }
        } else {
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
            setAllChats((prevchats) => [
              { sender: "you", message: msg, rightGuess },
              ...prevchats,
            ]);
          } else {
            setAllChats((prevchats) => [
              { sender: player.name, message: msg, rightGuess },
              ...prevchats,
            ]);
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

  const startPaint = (event) => {
    if (!currentUserDrawing) return;

    const coordinates = getCoordinates(event);
    console.log(context);
    if (coordinates) {
      setIsPainting(true);
      setMousePosition(coordinates);
      if (straightLineMode) {
        setStartPoint(coordinates);
      }
    }
  };

  const paint = (event) => {
    if (!isPainting || straightLineMode) {
      return;
    }
    const newMousePosition = getCoordinates(event);
    if (mousePosition && newMousePosition) {
      if (isEraser) {
        eraseLine(newMousePosition);
      } else {
        drawLine(newMousePosition);
      }
      setMousePosition(newMousePosition);
    }
  };

  const exitPaint = () => {
    setIsPainting(false);
    setMousePosition(undefined);
    setStartPoint(null);
  };

  const getCoordinates = (event) => {
    // const canvas = canvasRef.current;
    return {
      x: event.pageX - canvasRef.current.offsetLeft,
      y: event.pageY - canvasRef.current.offsetTop,
    };
  };

  const drawLine = async (position) => {
    // const canvas = canvasRef.current;
    // const context = canvas.getContext('2d');
    // if (context) {
    context.strokeStyle = color; // Set the stroke style to the current color
    context.beginPath(); // Start a new path for each line segment
    context.moveTo(mousePosition.x, mousePosition.y);
    context.lineTo(position.x, position.y);
    context.lineWidth = radius;

    context.stroke();
    const dataURL = await canvasRef.current.toDataURL("image/png");
    socket.emit("sending", dataURL);
    const newLines = [
      ...lines,
      { start: mousePosition, end: position, color, radius },
    ];
    setLines(newLines);
    setMousePosition(position); // Update mouse position
    // }
  };
  const handleMouseUp = (event) => {
    if (straightLineMode && startPoint) {
      drawStraightLine(event);
    }
    exitPaint();
  };

  const drawStraightLine = async (event) => {
    // const canvas = canvasRef.current;
    // const context = canvas.getContext('2d');

    // Handle potential errors (optional)
    // if (!canvas || !context) {
    //   console.error('Canvas or context unavailable for drawing line.');
    //   return;
    // }

    // Check if straight line mode is enabled and startPoint is set
    if (straightLineMode && startPoint) {
      const endPoint = getCoordinates(event); // Get release coordinates

      context.strokeStyle = color;
      context.lineWidth = radius;
      context.beginPath();
      context.moveTo(startPoint.x, startPoint.y);
      context.lineTo(endPoint.x, endPoint.y);
      context.stroke();

      const dataURL = await canvasRef.current.toDataURL("image/png");
      socket.emit("sending", dataURL);
      // Reset startPoint for next straight line
      setStartPoint(null);
    }
  };
  const eraseLine = async (position) => {
    // const canvas = canvasRef.current;
    // const context = canvas.getContext('2d');
    // if (context) {
    const imageData = context.getImageData(
      position.x - radius,
      position.y - radius,
      2 * radius,
      2 * radius
    );
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      // Set alpha channel to 0 to erase
      data[i + 3] = 0;
    }
    context.putImageData(imageData, position.x - radius, position.y - radius);

    const dataURL = await canvasRef.current.toDataURL("image/png");
    socket.emit("sending", dataURL);
    const newLines = lines.filter((line) => {
      const startX = Math.min(line.start.x, line.end.x) - radius;
      const endX = Math.max(line.start.x, line.end.x) + radius;
      const startY = Math.min(line.start.y, line.end.y) - radius;
      const endY = Math.max(line.start.y, line.end.y) + radius;
      return (
        position.x < startX ||
        position.x > endX ||
        position.y < startY ||
        position.y > endY
      );
    });
    setLines(newLines);
    // }
  };
  const fillCanvas = async () => {
    // const canvas = canvasRef.current;
    // if (!canvas) {
    //     console.error('Canvas element not found.');
    //     return;
    // }

    // const context = canvas.getContext('2d');
    // if (!context) {
    //     console.error('Canvas context not available.');
    //     return;
    // }
    if (!currentUserDrawing) return;

    context.fillStyle = color; // Set the fill color to the current color
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Fill the entire canvas
    const dataURL = await canvasRef.current.toDataURL("image/png");
    socket.emit("sending", dataURL);
  };

  const clearCanvas = async () => {
    // const canvas = canvasRef.current;
    // const context = canvas.getContext('2d');
    // if (context) {
    if (!currentUserDrawing) return;

    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setLines([]);
    const dataURL = await canvasRef.current.toDataURL("image/png");
    socket.emit("sending", dataURL);
  };

  const clearCanvasAfterTurn = () => {
    if (context) {
      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };
  const handleChangeText = (e) => {
    setInputMessage(e.target.value);
  };
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!inputMessage) {
      return;
    }
    console.log(inputMessage);
    socket.emit("sending-chat", inputMessage.toLocaleLowerCase());
    console.log("socekt in send msg:", socket.id);
    setInputMessage("");
  };

  const handleWorSelect = (w) => {
    setShowWords(false);
    setSelectedWord(w);
    //emit to bacikend this wordd
    socket.emit("word-select", w);
    setWords([]);
  };

  const getRandomWords = () => {
    let lengthWordArray = getWordsArrayLength();
    let newWordsArray = [];
    let newIndex;
    let prevIndex = -1;
    for (let i = 0; i < 3; i++) {
      newIndex = Math.floor(Math.random() * lengthWordArray);

      while (newIndex === prevIndex) {
        newIndex = Math.floor(Math.random() * lengthWordArray);
      }
      newWordsArray.push(wordsArray[newIndex]);
      prevIndex = newIndex;
    }
    console.log(newWordsArray);
    return newWordsArray;
  };
  const basicColors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#C0C0C0",
    "#808080",
    "#FFFFFF",
  ];

  return (
    <div className="relative w-screen h-screen">
      <div className="w-full h-full flex flex-col justify-center items-center gap-4">
        <div>
          <WordBar
            showClock={showClock}
            wordLen={wordLen}
            gameStarted={gameStarted}
            showWords={showWords}
            currentUserDrawing={currentUserDrawing}
            selectedWord={selectedWord}
          />
        </div>
        <div className="w-full flex justify-center items-center gap-10">
          <div className="w-[300px] h-[540px] border border-black bg-white text-black">
            {allPlayers &&
              allPlayers.map((pl, idx) => (
                <PlayerCard
                  key={idx}
                  pl={pl}
                  curruser={pl.id === socket.id}
                  playerDrawing={playerDrawing}
                />
              ))}
          </div>
          <div className="w-[680px] h-[540px] ">
            <canvas
              ref={canvasRef}
              width={680}
              height={540}
              onMouseDown={startPaint}
              onMouseMove={paint}
              onMouseUp={handleMouseUp}
              onMouseLeave={exitPaint}
              className={`${!currentUserDrawing ? "cursor-not-allowed" : ""}`}
              style={{ border: "1px solid #000", backgroundColor: "white" }}
            />
            <div>
              {showWords && playerDrawing && playerDrawing.id === socket.id && (
                <div className="absolute top-0 left-0 h-full w-full flex justify-center gap-10 items-center z-10 bg-white bg-opacity-80">
                  {words.map((w, idx) => (
                    <div
                      onClick={() => handleWorSelect(w)}
                      key={idx}
                      className="text-black text-center w-36 h-7 border-2 rounded-md border-black"
                    >
                      {w}
                    </div>
                  ))}
                </div>
              )}
              {showWords && playerDrawing && playerDrawing.id !== socket.id && (
                <div className="text-black absolute h-full w-full top-0 left-0 flex justify-center items-center z-10 bg-white bg-opacity-80">
                  {`${playerDrawing.name} is choosing a word`}
                </div>
              )}
            </div>
          </div>
          <div className="w-[300px] h-[540px] border border-black flex flex-col-reverse rounded-b-lg p-1">
            <form
              onSubmit={(e) => {
                handleSubmitForm(e);
              }}
            >
              <input
                value={inputMessage}
                placeholder="Type your guess here"
                className={`min-w-full active max-w-full text-black flex flex-wrap px-6 py-2 rounded-lg font-medium bg-sky-50 bg-opacity-40 border border-blue-300 placeholder-gray-400 text-md focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-0 focus:shadow-[0_0px_10px_2px_#bfdbfe] ${
                  currentUserDrawing || showWords || !gameStarted
                    ? "cursor-not-allowed"
                    : ""
                }`}
                onChange={(e) => handleChangeText(e)}
                disabled={currentUserDrawing || showWords || !gameStarted || guessedWord}
              ></input>
            </form>
            {allChats &&
              allChats.length > 0 &&
              allChats.map((chat, idx) => (
                <p
                  className={`${
                    chat.rightGuess ? "bg-green-200 text-green-600" : ""
                  }`}
                  key={idx}
                >
                  {chat.rightGuess
                    ? chat.message
                    : `${chat.sender}: ${chat.message}`}
                </p>
              ))}
          </div>
        </div>
        {currentUserDrawing && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              {basicColors.map((c, index) => (
                <button
                  key={index}
                  style={{
                    backgroundColor: c,
                    width: "40px",
                    height: "40px",
                    margin: "0 5px",
                    border: "2px solid #333",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "border-color 0.3s ease",
                    outline: "none",
                    boxShadow: "3px 3px 5px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s",
                  }}
                  onClick={() => setColor(c)}
                  onMouseEnter={(e) => (e.target.style.borderColor = "#FFA500")}
                  onMouseLeave={(e) => (e.target.style.borderColor = "#333")}
                  className="zoom-btn"
                />
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <button
                className="zoom-btn"
                style={{
                  backgroundColor: "black",
                  padding: "8px 20px",
                  margin: "0 10px",
                  border: "2px solid black",
                  borderRadius: "10px",
                  fontFamily: "Comic Sans MS",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={() => setIsEraser(!isEraser)}
              >
                {isEraser ? "Draw" : "Eraser"}
              </button>
              <button
                className="zoom-btn"
                style={{
                  backgroundColor: "black",
                  padding: "8px 20px",
                  margin: "0 10px",
                  border: "2px solid black",
                  borderRadius: "10px",
                  fontFamily: "Comic Sans MS",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={() => setStraightLineMode(!straightLineMode)}
              >
                {straightLineMode
                  ? "Disable Straight Line"
                  : "Enable Straight Line"}
              </button>
              <button
                className="zoom-btn"
                style={{
                  backgroundColor: "black",
                  padding: "8px 20px",
                  margin: "0 10px",
                  border: "2px solid black",
                  borderRadius: "10px",
                  fontFamily: "Comic Sans MS",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={fillCanvas}
              >
                Fill Canvas
              </button>
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  if (e.target.value !== color) {
                    setColor(e.target.value);
                  }
                }}
                style={{ marginLeft: "10px", marginRight: "10px" }}
              />
              <label>Radius:</label>
              <input
                type="range"
                min="1"
                max="100"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                style={{ marginLeft: "5px", marginRight: "10px" }}
              />

              <button
                className="zoom-btn"
                style={{
                  padding: "8px 20px",
                  margin: "0 10px",
                  border: "2px solid black",
                  borderRadius: "10px",
                  fontFamily: "Comic Sans MS",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "white",
                  cursor: "pointer",
                }}
                onClick={clearCanvas}
              >
                Clear
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PlayScreen;

// className={`${!currentUserDrawing?"cursor-not-allowed":""}`}
//
