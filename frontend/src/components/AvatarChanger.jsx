import React, { useState } from 'react';

const AvatarChanger = () => {
    const [avatarUrl, setAvatarUrl] = useState('');

    const fetchNewAvatar = () => {
        const seed = Math.random().toString(36).substring(7);
        const newAvatarUrl = `https://avatars.dicebear.com/api/open-peeps/${seed}.svg`;
        setAvatarUrl(newAvatarUrl);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <div>
                {avatarUrl && (
                    <img src={avatarUrl} alt="Avatar" style={{ width: '200px', height: '200px' }} />
                )}
            </div>
            <button onClick={fetchNewAvatar} style={{ marginTop: '20px' }}>Next Avatar</button>
        </div>
    );
};

export default AvatarChanger;
