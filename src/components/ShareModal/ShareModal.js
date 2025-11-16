import { useState } from 'react';
import './ShareModal.css';

const ShareModal = ({ form, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/form/${form.id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Поділитися опитуванням</h2>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
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
          <div className="share-options-section">
            <h3>Налаштування доступу</h3>
            <label className="share-option">
              <input type="checkbox" defaultChecked />
              <span>Публічне посилання</span>
            </label>
            <label className="share-option">
              <input type="checkbox" />
              <span>Захист паролем</span>
            </label>
            <label className="share-option">
              <input type="checkbox" />
              <span>Обмежити кількість відповідей</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

