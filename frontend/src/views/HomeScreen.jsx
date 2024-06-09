import React, { useState } from "react";
import "../App.css";
import AvatarChanger from "../components/AvatarChanger";
import Footer from "../components/Footer";

function HomeScreen() {
  // State variables to store user data
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("en");
  const [avatar, setAvatar] = useState(null);
  const [roomCode, setRoomCode] = useState("");

  // Handler functions to update state
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleAvatarChange = (newAvatar) => {
    setAvatar(newAvatar);
  };

  const handleRoomCodeChange = (e) => {
    setRoomCode(e.target.value);
  };

  const handlePlayButtonClick = () => {
    const userData = {
      username,
      language,
      avatar,
      roomCode
    };
    console.log("User Data:", userData);
    // You can now send userData to a server or use it as needed
  };

  return (
    <div>
      <header className="app-header">
        <h1>skribblay.you</h1>
      </header>
      <div className="main-container">
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter your Name"
            className="input"
            value={username}
            onChange={handleUsernameChange}
          />
          <select className="input" value={language} onChange={handleLanguageChange}>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
          </select>
        </div>
        <AvatarChanger onAvatarChange={handleAvatarChange} />
        <input
          type="text"
          placeholder="Enter room code Here"
          className="room-code-input"
          value={roomCode}
          onChange={handleRoomCodeChange}
        />
        <button className="play-button" onClick={handlePlayButtonClick}>Play !</button>
      </div>
      <Footer className="footer-icon" />
    </div>
  );
}

export default HomeScreen;
