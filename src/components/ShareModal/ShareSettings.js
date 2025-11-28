import React from 'react';
import { Input } from '../UI/Input';
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
                        <Input
                            type="password"
                            placeholder="Введіть пароль для доступу"
                            value={shareSettings.password}
                            onChange={(e) =>
                                onUpdate({ password: e.target.value })
                            }
                            className="share-option-input-wrapper"
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
                        <Input
                            type="number"
                            min="1"
                            placeholder="Наприклад, 100"
                            value={shareSettings.maxResponses}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                onUpdate({ maxResponses: value });
                            }}
                            className="share-option-input-wrapper"
                        />
                    </div>
                )}
            </label>

            <label className="share-option">
                <div className="share-option-main">
                    <input
                        type="checkbox"
                        checked={!!shareSettings.expiresAt}
                        onChange={(e) =>
                            onUpdate({ expiresAt: e.target.checked ? new Date().toISOString().slice(0, 16) : '' })
                        }
                    />
                    <span>Дата закінчення</span>
                </div>
                {!!shareSettings.expiresAt && (
                    <div className="share-option-extra">
                        <Input
                            type="datetime-local"
                            value={shareSettings.expiresAt}
                            onChange={(e) =>
                                onUpdate({ expiresAt: e.target.value })
                            }
                            className="share-option-input-wrapper"
                        />
                    </div>
                )}
            </label>

            <label className="share-option">
                <div className="share-option-main">
                    <input
                        type="checkbox"
                        checked={shareSettings.showResults}
                        onChange={(e) =>
                            onUpdate({ showResults: e.target.checked })
                        }
                    />
                    <span>Показувати результати після відповіді</span>
                </div>
            </label>

            <label className="share-option">
                <div className="share-option-main">
                    <input
                        type="checkbox"
                        checked={shareSettings.oneResponsePerDevice}
                        onChange={(e) =>
                            onUpdate({ oneResponsePerDevice: e.target.checked })
                        }
                    />
                    <span>Одна відповідь на пристрій</span>
                </div>
                <p className="share-option-description">
                    Перевіряє IP-адресу та файли cookie для запобігання повторним відповідям.
                </p>
            </label>
        </div>
    );
};

export default ShareSettings;
