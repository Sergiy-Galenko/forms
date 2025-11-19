import React from 'react';
import './FormBuilder.css';

const FormBuilderHeader = ({ onBack, onSave, onPublish }) => {
    return (
        <div className="builder-header">
            <button className="btn-secondary" onClick={onBack}>
                ← Назад
            </button>
            <div className="builder-actions">
                <button className="btn-secondary" onClick={onSave}>
                    Зберегти
                </button>
                <button className="btn-primary" onClick={onPublish}>
                    Опублікувати
                </button>
            </div>
        </div>
    );
};

export default FormBuilderHeader;
