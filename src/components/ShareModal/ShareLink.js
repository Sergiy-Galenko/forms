import React, { useState } from 'react';
import './ShareModal.css';

const ShareLink = ({ shareUrl }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="share-url-section">
            <label>Посилання для опитування</label>
            <div className="url-input-group">
                <input
                    type="text"
                    className="url-input"
                    value={shareUrl}
                    readOnly
                />
                <button className="btn-primary" onClick={copyToClipboard}>
                    {copied ? '✓ Скопійовано' : 'Копіювати'}
                </button>
            </div>
        </div>
    );
};

export default ShareLink;
