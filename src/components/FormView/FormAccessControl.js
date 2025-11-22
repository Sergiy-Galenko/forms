import React, { useState } from 'react';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
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
                        <Input
                            type="password"
                            placeholder="Введіть пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={passwordError}
                            className="form-input-wrapper"
                        />
                        <Button type="submit" variant="primary" fullWidth className="btn-submit">
                            Продовжити
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormAccessControl;
