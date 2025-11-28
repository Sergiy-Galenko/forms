import React, { useState, useMemo } from 'react';
import { QUESTION_TYPES } from '../../types';
import { Input, TextArea } from '../UI/Input';
import { Button } from '../UI/Button';
import './FormView.css';

const FormRenderer = ({ currentForm, onSubmit, guidedMode }) => {
    const [answers, setAnswers] = useState({});
    const [touched, setTouched] = useState({});

    const handleAnswer = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleBlur = (questionId) => {
        setTouched(prev => ({ ...prev, [questionId]: true }));
    };

    const validateQuestion = (question) => {
        if (!question.required) return null;
        const answer = answers[question.id];
        if (!answer || (Array.isArray(answer) && answer.length === 0)) {
            return 'Це поле є обов\'язковим';
        }
        return null;
    };

    const progress = useMemo(() => {
        if (!currentForm.questions.length) return 0;
        const answeredCount = currentForm.questions.filter(q => {
            const answer = answers[q.id];
            return answer && (!Array.isArray(answer) || answer.length > 0);
        }).length;
        return Math.round((answeredCount / currentForm.questions.length) * 100);
    }, [currentForm.questions, answers]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate all required questions
        const requiredQuestions = currentForm.questions.filter(q => q.required);
        const missing = requiredQuestions.filter(q => !answers[q.id] ||
            (Array.isArray(answers[q.id]) && answers[q.id].length === 0));

        if (missing.length > 0) {
            // Mark all missing as touched to show errors
            const newTouched = {};
            missing.forEach(q => newTouched[q.id] = true);
            setTouched(prev => ({ ...prev, ...newTouched }));
            alert('Будь ласка, заповніть всі обов\'язкові питання');
            return;
        }

        onSubmit(answers);
    };

    return (
        <div className="form-view">
            <div className="form-container">
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>

                {guidedMode && (
                    <div className="form-hint">
                        <p className="hint-title">Як пройти опитування</p>
                        <ul>
                            <li>Зірочка означає обов’язкову відповідь.</li>
                            <li>Якщо помилилися — можна виправити до відправлення.</li>
                            <li>Натисніть «Відправити» після заповнення всіх полів.</li>
                        </ul>
                    </div>
                )}

                <div className="form-header">
                    <h1>{currentForm.title}</h1>
                    {currentForm.description && (
                        <p className="form-description">{currentForm.description}</p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="form-content">
                    {currentForm.questions.map((question, index) => {
                        const error = touched[question.id] ? validateQuestion(question) : null;

                        return (
                            <div key={question.id} className={`question-block ${error ? 'has-error' : ''}`}>
                                <label className="question-label">
                                    {index + 1}. {question.title}
                                    {question.required && <span className="required">*</span>}
                                </label>

                                {question.type === QUESTION_TYPES.TEXT && (
                                    <Input
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswer(question.id, e.target.value)}
                                        onBlur={() => handleBlur(question.id)}
                                        error={error}
                                        className="form-input-wrapper"
                                    />
                                )}

                                {question.type === QUESTION_TYPES.TEXTAREA && (
                                    <TextArea
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswer(question.id, e.target.value)}
                                        onBlur={() => handleBlur(question.id)}
                                        rows={4}
                                        error={error}
                                        className="form-textarea-wrapper"
                                    />
                                )}

                                {question.type === QUESTION_TYPES.SINGLE_CHOICE && (
                                    <div className="options-list">
                                        {question.options?.map((option) => (
                                            <label key={option.id} className="radio-option">
                                                <input
                                                    type="radio"
                                                    name={question.id}
                                                    value={option.text}
                                                    checked={answers[question.id] === option.text}
                                                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                                                    onBlur={() => handleBlur(question.id)}
                                                />
                                                <span>{option.text}</span>
                                            </label>
                                        ))}
                                        {error && <div className="error-message">{error}</div>}
                                    </div>
                                )}

                                {question.type === QUESTION_TYPES.MULTIPLE_CHOICE && (
                                    <div className="options-list">
                                        {question.options?.map((option) => (
                                            <label key={option.id} className="checkbox-option">
                                                <input
                                                    type="checkbox"
                                                    checked={(answers[question.id] || []).includes(option.text)}
                                                    onChange={(e) => {
                                                        const current = answers[question.id] || [];
                                                        const updated = e.target.checked
                                                            ? [...current, option.text]
                                                            : current.filter(v => v !== option.text);
                                                        handleAnswer(question.id, updated);
                                                    }}
                                                    onBlur={() => handleBlur(question.id)}
                                                />
                                                <span>{option.text}</span>
                                            </label>
                                        ))}
                                        {error && <div className="error-message">{error}</div>}
                                    </div>
                                )}

                                {question.type === QUESTION_TYPES.SCALE && (
                                    <div className="scale-input">
                                        <div className="scale-labels">
                                            {question.scale?.minLabel && (
                                                <span className="scale-label-min">{question.scale.minLabel}</span>
                                            )}
                                            {question.scale?.maxLabel && (
                                                <span className="scale-label-max">{question.scale.maxLabel}</span>
                                            )}
                                        </div>
                                        <input
                                            type="range"
                                            min={question.scale?.min || 1}
                                            max={question.scale?.max || 5}
                                            value={answers[question.id] || question.scale?.min || 1}
                                            onChange={(e) => handleAnswer(question.id, parseInt(e.target.value))}
                                            onBlur={() => handleBlur(question.id)}
                                            className="scale-slider"
                                        />
                                        <div className="scale-value">
                                            {answers[question.id] || question.scale?.min || 1}
                                        </div>
                                        {error && <div className="error-message">{error}</div>}
                                    </div>
                                )}

                                {question.type === QUESTION_TYPES.EMAIL && (
                                    <Input
                                        type="email"
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswer(question.id, e.target.value)}
                                        onBlur={() => handleBlur(question.id)}
                                        error={error}
                                        className="form-input-wrapper"
                                    />
                                )}

                                {question.type === QUESTION_TYPES.NUMBER && (
                                    <Input
                                        type="number"
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswer(question.id, e.target.value)}
                                        onBlur={() => handleBlur(question.id)}
                                        error={error}
                                        className="form-input-wrapper"
                                    />
                                )}

                                {question.type === QUESTION_TYPES.DATE && (
                                    <Input
                                        type="date"
                                        value={answers[question.id] || ''}
                                        onChange={(e) => handleAnswer(question.id, e.target.value)}
                                        onBlur={() => handleBlur(question.id)}
                                        error={error}
                                        className="form-input-wrapper"
                                    />
                                )}
                            </div>
                        );
                    })}

                    <div className="form-footer">
                        <Button type="submit" variant="primary" fullWidth className="btn-submit">
                            Відправити
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormRenderer;
