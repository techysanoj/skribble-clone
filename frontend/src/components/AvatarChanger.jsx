import React, { useState } from 'react';
import './AvatarChanger.css'
/*import { createAvatar } from '@dicebear/core';
import { openPeeps, adventurer, avataaars, bigEars, bigSmile,
    bottts, croodles, funEmoji, lorelei, loreleiNeutral, micah,
    miniavs, notionists, personas, 
 } from '@dicebear/collection';*/

function AvatarChanger({avatar,setAvatar,generateAvatar,changeAvatar}) {
  
  /*const [avatar, setAvatar] = useState(() => generateAvatar()); // Initialize avatar state with a default value

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
  }*/
  
  return (
        <div className="avatar-container">
          <button className="arrow-button-changer" onClick={changeAvatar}>←</button>
          <img src={avatar} alt="Avatar" className='avatar-img'/>
          <button className="arrow-button-changer" onClick={changeAvatar}>→</button>
        </div>
  );
}

export default AvatarChanger;
