import React, { useState } from 'react';
import Home from './Home.jsx';
import Email from './HowToPlay.jsx';
import Help from './News.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEnvelope, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [animation, setAnimation] = useState('');
  
    const handleIconClick = (icon) => {
      setSelectedIcon(icon);
      setAnimation('fade-in');
    };
  
    const closeDetail = () => {
      setAnimation('fade-out');
      setTimeout(() => {
        setSelectedIcon(null);
        setAnimation('');
      }, 0); // Duration of the fade-out animation
    };

  return (
    <div className="footer">
      <div className="icon-container">
        <div className="back-rectangle">
          <button onClick={() => handleIconClick('home')}>
            <FontAwesomeIcon icon={faHome} className="icon" />
          </button>
        </div>
        <div className="back-rectangle">
          <button onClick={() => handleIconClick('email')}>
            <FontAwesomeIcon icon={faQuestionCircle} className="icon" />
          </button>
        </div>
        <div className="back-rectangle">
          <button onClick={() => handleIconClick('help')}>
            <FontAwesomeIcon icon={faEnvelope} className="icon" />
          </button>
        </div>
      </div>
      {selectedIcon === 'home' && <Home onClose={closeDetail} />}
      {selectedIcon === 'email' && <Email onClose={closeDetail} />}
      {selectedIcon === 'help' && <Help onClose={closeDetail} />}
    </div>
  );
};

export default Footer;
