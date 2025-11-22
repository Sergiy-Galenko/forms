import React from 'react';
import { Button } from '../UI/Button';
import './FormView.css';

const FormSuccess = ({ setView }) => {
    return (
        <div className="form-view">
            <div className="form-container">
                <div className="success-message">
                    <div className="success-icon">✓</div>
                    <h2>Дякуємо за відповідь!</h2>
                    <p>Ваші відповіді успішно збережено.</p>
                    <Button variant="primary" onClick={() => setView('dashboard')}>
                        Повернутися до дашборду
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FormSuccess;
