import React from "react";
import "../App.css";
import AvatarChanger from "../components/AvatarChanger";
import Footer from "../components/Footer";


function HomeScreen() {
  return (
    <div>
      <header className="app-header">
        <h1>skribblay.you</h1>
      </header>
      <div className="main-container">
        <div className="input-container">
          <input type="text" placeholder="Enter your Name" className="input" />
          <select className="input">
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
          </select>
        </div>
        <div className="avatar-container">
          <button className="arrow-button">←</button>
          <img src="avatar.svg" alt="Avatar" className="avatar"></img>
          {/* <AvatarChanger/> */}
          <button className="arrow-button">→</button>
        </div>
        <input
          type="text"
          placeholder="Enter room code Here"
          className="room-code-input"
        />
        <button className="play-button">Play !</button>
      </div>
      <Footer/>
    </div>
  );
}

export default HomeScreen;
