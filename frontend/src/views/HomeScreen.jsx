import React, { useState } from "react";
import "../App.css";
import AvatarChanger from "../components/AvatarChanger";
import Footer from "../components/Footer";
import { createAvatar } from '@dicebear/core';
import { openPeeps, adventurer, avataaars, bigEars, bigSmile,
    bottts, croodles, funEmoji, lorelei, loreleiNeutral, micah,
    miniavs, notionists, personas, 
 } from '@dicebear/collection';

function HomeScreen() {
  // State variables to store user data
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("en");
  //const [avatar, setAvatar] = useState(null);
  const [roomCode, setRoomCode] = useState("");
  
    const [avatar, setAvatar] = useState(() => generateAvatar()); // Initialize avatar state with a default value
  
    const changeAvatar = () => {
      setAvatar(generateAvatar()); // Generate a new avatar when the button is clicked
    };
  
    // Function to generate a random avatar from the available collections
    function generateAvatar() {
      // Define an array of collections
      const collections = [
        openPeeps, adventurer, avataaars, bigEars, bigSmile,
        bottts, croodles, funEmoji, lorelei, loreleiNeutral, micah,
        miniavs, notionists, personas
      ];
  
      // Randomly select a collection
      const selectedCollection = collections[Math.floor(Math.random() * collections.length)];
  
      // Use createAvatar to generate an avatar with the selected collection and desired options
      const avatarSvg = createAvatar(selectedCollection, {
        seed: Math.random().toString(), // Use a random seed to generate different avatars each time
        size: 128,
      });
  
      // Convert the SVG to a Base64 string using encodeURIComponent
      const base64String = btoa(unescape(encodeURIComponent(avatarSvg)));
  
      // Combine the Base64 string with the data URI prefix
      return `data:image/svg+xml;base64,${base64String}`;
    }
  // Handler functions to update state
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  /*const handleAvatarChange = (newAvatar) => {
    setAvatar(newAvatar);
  };*/

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
}

export default HomeScreen;
