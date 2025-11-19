import React from 'react';
import './ShareModal.css';

const ShareSettings = ({ shareSettings, onUpdate }) => {
    return (
        <div className="share-options-section">
            <h3>Налаштування доступу</h3>

            <label className="share-option">
                <div className="share-option-main">
                    <input
                        type="checkbox"
                        checked={shareSettings.isPublic}
                        onChange={(e) =>
                            onUpdate({ isPublic: e.target.checked })
                        }
                    />
                    <span>Публічне посилання</span>
                </div>
                <p className="share-option-description">
                    Якщо вимкнути, сторінка за посиланням стане недоступною
                    для респондентів.
                </p>
            </label>

            <label className="share-option">
                <div className="share-option-main">
                    <input
                        type="checkbox"
                        checked={shareSettings.passwordEnabled}
                        onChange={(e) =>
                            onUpdate({ passwordEnabled: e.target.checked })
                        }
                    />
                    <span>Захист паролем</span>
                </div>
                {shareSettings.passwordEnabled && (
                    <div className="share-option-extra">
                        <input
                            type="password"
                            className="share-option-input"
                            placeholder="Введіть пароль для доступу"
                            value={shareSettings.password}
                            onChange={(e) =>
                                onUpdate({ password: e.target.value })
                            }
                        />
                    </div>
                )}
            </label>

            <label className="share-option">
                <div className="share-option-main">
                    <input
                        type="checkbox"
                        checked={shareSettings.limitResponsesEnabled}
                        onChange={(e) =>
                            onUpdate({
                                limitResponsesEnabled: e.target.checked
                            })
                        }
                    />
                    <span>Обмежити кількість відповідей</span>
                </div>
                {shareSettings.limitResponsesEnabled && (
                    <div className="share-option-extra">
                        <input
                            type="number"
                            min="1"
                            className="share-option-input"
                            placeholder="Наприклад, 100"
                            value={shareSettings.maxResponses}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                onUpdate({ maxResponses: value });
                            }}
                        />
                    </div>
                )}
            </label>
        </div>
    );
};

export default ShareSettings;
