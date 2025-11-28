import React from 'react';
import { Button } from '../UI/Button';
import './FormBuilder.css';

const FormBuilderHeader = ({ onBack, onSave, onPublish, readiness = 0, checklist = [] }) => {
    return (
        <div className="builder-header">
            <div className="builder-header-left">
                <Button variant="secondary" onClick={onBack}>
                    ← Назад
                </Button>
                <div className="builder-status">
                    <p className="eyebrow">Готовність форми</p>
                    <div className="builder-progress">
                        <div className="builder-progress-bar" style={{ width: `${Math.max(readiness, 8)}%` }} />
                    </div>
                    <div className="builder-checklist">
                        {checklist.map((item) => (
                            <span
                                key={item.label}
                                className={`builder-chip ${item.done ? 'is-done' : ''}`}
                            >
                                {item.done ? '✓' : '•'} {item.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

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
