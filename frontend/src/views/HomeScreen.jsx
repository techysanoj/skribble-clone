// HomeScreen.jsx
import React, { useState } from "react";
import "../App.css";
import AvatarChanger from "../components/AvatarChanger";
import Footer from "../components/Footer";
import { createAvatar } from '@dicebear/core';
import { openPeeps, adventurer, avataaars, bigEars, bigSmile, bottts, croodles, funEmoji, lorelei, loreleiNeutral, micah, miniavs, notionists, personas } from '@dicebear/collection';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("en");
  const [avatar, setAvatar] = useState(() => generateAvatar());
  const [roomCode, setRoomCode] = useState("");

  function generateAvatar() {
    const collections = [
      openPeeps, adventurer, avataaars, bigEars, bigSmile,
      bottts, croodles, funEmoji, lorelei, loreleiNeutral, micah,
      miniavs, notionists, personas
    ];
    const selectedCollection = collections[Math.floor(Math.random() * collections.length)];
    const avatarSvg = createAvatar(selectedCollection, {
      seed: Math.random().toString(),
      size: 128,
    });
    const base64String = btoa(unescape(encodeURIComponent(avatarSvg.toString())));
    return `data:image/svg+xml;base64,${base64String}`;
  }

  const changeAvatar = () => {
    setAvatar(generateAvatar());
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleRoomCodeChange = (e) => {
    setRoomCode(e.target.value);
  };

  const handlePlayButtonClick = () => {
    if(!username || !avatar || !language){
      console.log("please fill in all the details")
      return;
    }
    const userData = {
      username,
      language,
      avatar,
      roomCode
    };
    console.log("User Data:", userData);
    localStorage.setItem("username", username)
    navigate('/play', { state: { username, avatar } });
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
        <AvatarChanger avatar={avatar} setAvatar={setAvatar} generateAvatar={generateAvatar} changeAvatar={changeAvatar} />
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
};

export default HomeScreen;
