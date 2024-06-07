import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Buffer } from "buffer";

function PlayScreen() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [allChats, setAllChats] = useState([]);
  const [allPlayers, setAllPlayer] = useState([]);
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const newSocket = io.connect("http://localhost:3001");
    console.log(newSocket);
    setSocket(newSocket);
    // newSocket.emit("player-joined",newSocket.id)
    // return()=>{
    //   newSocket.disconnect();
    // }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("updated-players", (updatedplayers) => {
        console.log(updatedplayers);
        setAllPlayer(updatedplayers);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      //  socket.on("drawing", ({ x0, y0, x1, y1, color })=>{
      //   // drawLine(context, x0, y0, x1, y1, color, false);
      //  })
      socket.on("recieving", async (data) => {
        //   console.log(data)

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

  useEffect(() => {
    if (socket) {
      socket.on("recieve-chat", ({ msg, userID, rightGuess }) => {
        console.log(msg, userID, rightGuess);
        if (rightGuess) {
          // will be adding an attr to chat object later for the green colour
          // one option that can be further explored is that push the messages in efrontend withut sending all chats from the backend
          if (userID === socket.id) {
            // chats.pop();
            setAllChats(prevchats=>[{sender: "you", message:"you guessed the right word!"}, ...prevchats]);
          }else{
            setAllChats(prevchats=>[{sender:userID, message:`guessed the word right!`}, ...prevchats])

          }
        }else{
          if (userID === socket.id) {
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
            setAllChats(prevchats=>[{sender: "you", message: msg}, ...prevchats])

          }else{

            setAllChats(prevchats=>[ {sender: userID, message: msg},...prevchats])
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
    if (!isDrawing) return;
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
  return (
    // <div>PlayScreen</div>
    <div className=" relative w-screen h-screen ">
      <div className="w-full h-full   flex justify-center items-center gap-10">
        <div className=" w-[300px] h-[540px] border border-black"></div>
        <div className="w-[680px] h-[540px] bg-yellow-50">
          <canvas
            ref={canvasRef}
            width={680}
            height={540}
            style={{ border: "1px solid #000" }}
            onMouseDown={startDrawing}
            onMouseMove={putpoint}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
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
              className="min-w-full active max-w-full flex flex-wrap px-6 py-2 rounded-lg font-medium bg-sky-50  bg-opacity-40 border border-blue-300 placeholder-gray-400 text-md focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-1 focus:shadow-[0_0px_10px_5px_#bfdbfe]"
              onChange={(e) => handleChangeText(e)}
            ></input>
          </form>

          {allChats && allChats.length>0 && allChats.map((chat, idx) => <p key={idx}>{
          `${chat.sender}: ${chat.message}`
        // chat
          }</p>)}
        </div>
      </div>
    </div>
  );
}

export default PlayScreen;
