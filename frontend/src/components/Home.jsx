import React from 'react';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faXmark } from '@fortawesome/free-solid-svg-icons';

const Home = ({ onClose }) => {
  return (
    <div className="main-container-home">
      <header className="home-header">
        <FontAwesomeIcon icon={faHome} className="icon" />
        <h1 className="home-h1">About Us</h1>
        <FontAwesomeIcon icon={faXmark} className="icon" id="icon-cross" onClick={onClose} />
      </header>
      <p className="paragraph-home">
        skribblay.you is a free online multiplayer drawing and guessing pictionary game (clone of the website skribbl.me). A normal game consists of a few rounds, where every round a player has to draw their chosen word and others have to guess it to gain points! The person with the most points at the end of the game, will then be crowned as the winner! Have fun!
      </p>
    </div>
  );
};

export default Home;
