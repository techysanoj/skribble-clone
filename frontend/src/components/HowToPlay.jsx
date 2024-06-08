import React from "react";
import "./HowToPlay.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle, faXmark } from "@fortawesome/free-solid-svg-icons";

const Home = ({ onClose }) => {
  return (
    <div className="main-container-how">
      <header className="home-header">
        <FontAwesomeIcon icon={faQuestionCircle} className="icon" />
        <h1 className="how-h1">How to Play?</h1>
        <FontAwesomeIcon
          icon={faXmark}
          className="icon"
          id="icon-cross"
          onClick={onClose}
        />
      </header>
      <p className="paragraph-how">
        Start Game. Once everyone has joined, click ‘Start Game’ to begin. The
        round begins. One of the players will choose one of the words. Using the
        colors and paint brush options at the bottom, they will draw the picture
        to the best of their ability. Time to guess. Using the textbox on the
        right, other plays will type their guesses. Guessers can use the drawing
        or the dashes/letters that appear on the top. To guess, just type the
        word (for example, type “fish” rather than “I think the word is fish”).
        Guessers have an unlimited number of guesses, so if you get it wrong you
        can try it again. Wrong guesses will appear on the left. Correct guess.
        Once a player has correctly guessed the word, a message appears saying
        “______ has guessed the word”. They will wait until the round is
        finished. That person can send messages, but they will not appear to
        players who haven’t yet guessed the correct word. End of round. The
        round has ended once everyone has guessed the word or the time is over,
        whichever comes first. Points are awarded. Points are awarded based on
        how fast and how accurate you are able to guess. If you are unable to
        guess the correct answer before time runs out, no points are awarded.
        Points are also awarded to the drawer based on how many people were able
        to correctly guess the word. Continue to play. Continue to play the
        rounds. Once the game has ended, you will see the total of points and
        the grand winner. You can play another game if you’d like or exit out.
      </p>
    </div>
  );
};

export default Home;
