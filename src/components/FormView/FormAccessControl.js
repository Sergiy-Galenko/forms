import React, { useState } from 'react';
import './FormView.css';

const FormAccessControl = ({
    isPublicLink,
    shareSettings,
    limitReached,
    currentForm,
    onAuthorized
}) => {
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    if (isPublicLink && !shareSettings.isPublic) {
        return (
            <div className="form-view">
                <div className="form-container">
                    <div className="access-message">
                        <h2>Опитування недоступне</h2>
                        <p>Організатор вимкнув публічний доступ до цього опитування.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (limitReached) {
        return (
            <div className="form-view">
                <div className="form-container">
                    <div className="access-message">
                        <h2>Ліміт відповідей вичерпано</h2>
                        <p>Це опитування вже набрало максимально дозволену кількість відповідей.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="form-view">
            <div className="form-container">
                <div className="password-gate">
                    <h1>{currentForm.title}</h1>
                    <p className="form-description">Це опитування захищене паролем.</p>
                    <form
                        className="password-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!shareSettings.password) {
                                setPasswordError('Пароль ще не налаштований організатором.');
                                return;
                            }
                            if (password === shareSettings.password) {
                                onAuthorized();
                                setPasswordError('');
                            } else {
                                setPasswordError('Невірний пароль');
                            }
                        }}
                    >
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Введіть пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && <p className="password-error">{passwordError}</p>}
                        <button type="submit" className="btn-primary btn-submit">
                            Продовжити
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormAccessControl;
