import React, { useState } from 'react';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import './FormView.css';

const FormAccessControl = ({ state, onPasswordSubmit }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onPasswordSubmit(password);
    };

    if (state === 'password') {
        return (
            <div className="form-access-control">
                <div className="access-card">
                    <div className="access-icon">🔒</div>
                    <h2>Цей опитування захищено паролем</h2>
                    <p>Будь ласка, введіть пароль, щоб продовжити</p>
                    <form onSubmit={handleSubmit}>
                        <Input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="access-input"
                        />
                        <Button type="submit" variant="primary" fullWidth>
                            Увійти
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    let message = '';
    let icon = '';

    switch (state) {
        case 'closed':
            icon = '🔒';
            message = 'Це опитування наразі закрите автором.';
            break;
        case 'limited':
            icon = '✋';
            message = 'Це опитування досягло ліміту відповідей.';
            break;
        case 'expired':
            icon = '⏰';
            message = 'Термін дії цього опитування закінчився.';
            break;
        case 'already_responded':
            icon = '✅';
            message = 'Ви вже пройшли це опитування.';
            break;
        default:
            icon = '⚠️';
            message = 'Доступ обмежено.';
    }

    return (
        <div className="form-access-control">
            <div className="access-card">
                <div className="access-icon">{icon}</div>
                <h2>Доступ обмежено</h2>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default FormAccessControl;
