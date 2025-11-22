import React, { useState } from 'react';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
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
                <Input
                    value={shareUrl}
                    readOnly
                    className="url-input-wrapper"
                />
                <Button variant="primary" onClick={copyToClipboard}>
                    {copied ? '✓ Скопійовано' : 'Копіювати'}
                </Button>
            </div>
        </div>
    );
};

export default ShareLink;
