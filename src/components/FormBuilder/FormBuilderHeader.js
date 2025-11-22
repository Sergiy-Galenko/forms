import React from 'react';
import { Button } from '../UI/Button';
import './FormBuilder.css';

const FormBuilderHeader = ({ onBack, onSave, onPublish }) => {
    return (
        <div className="builder-header">
            <Button variant="secondary" onClick={onBack}>
                ← Назад
            </Button>
            <div className="builder-actions">
                <Button variant="secondary" onClick={onSave}>
                    Зберегти
                </Button>
                <Button variant="primary" onClick={onPublish}>
                    Опублікувати
                </Button>
            </div>
        </div>
    );
};

export default FormBuilderHeader;
