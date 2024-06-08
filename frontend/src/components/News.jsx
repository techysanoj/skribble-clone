import React from 'react';
import './News.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEnvelopeOpen, faHome, faXmark } from '@fortawesome/free-solid-svg-icons';

const Home = ({ onClose }) => {
  return (
    <div className="main-container-home">
      <header className="home-header">
        <FontAwesomeIcon icon={faEnvelope} className="icon" />
        <h1 className="home-h1">News</h1>
        <FontAwesomeIcon icon={faXmark} className="icon" id="icon-cross" onClick={onClose} />
      </header>
      <p className="paragraph-home">
        skribblay.you is a free online multiplayer drawing and guessing pictionary game (clone of the website skribbl.me). A normal game consists of a few rounds, where every round a player has to draw their chosen word and others have to guess it to gain points! The person with the most points at the end of the game, will then be crowned as the winner! Have fun!
      </p>
    </div>
  );
};

export default Home;
